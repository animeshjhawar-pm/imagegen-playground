// ---------------------------------------------------------------------------
// Playground state reducer
// ---------------------------------------------------------------------------

import type { PageType, ImageType, StepStatus, PipelineDefinition } from "@/config/pipelines";
import { PIPELINES } from "@/config/pipelines";

// ---------------------------------------------------------------------------
// State interfaces
// ---------------------------------------------------------------------------

export interface PromptOverride {
  systemPrompt: string;
  userPrompt: string;
}

export interface StepState {
  /** Current raw values — only populated for inputs the user explicitly edited. */
  inputs: Record<string, string>;
  /** Fix 2: per-input manual override flag. True → display inputs[name]; False → derive from upstream. */
  inputOverrides: Record<string, boolean>;
  output: string;
  /** Preserved so "Reset Override" can restore the last API result. */
  lastRunOutput: string;
  status: StepStatus;
  error?: string;
  /** Non-fatal notice surfaced alongside a successful output (e.g. input truncation). */
  warning?: string;
  /** Fix 2: renamed from isManualOverride. True when user edited the output manually. */
  isOutputOverride: boolean;
  /** When set, both system + user prompts are sent literally (no template interpolation). */
  promptOverride?: PromptOverride;
  /** Per-step config (opaque to the reducer; interpreted by the API route).
   *  Currently used by generate_image for model + search toggles. */
  stepConfig?: Record<string, unknown>;
}

export interface FlowState {
  stepStates: Record<string, StepState>;
}

export interface ClientState {
  id: string;
  name: string;
  context: Record<string, string>;
  oldFlow: FlowState;
  /** One or more "New"-flow lanes. Index 0 is the original "New"; index 1
   *  is "New 2", etc. Users can stack additional new flows per client to
   *  compare prompt/flow variants side-by-side. Old flow stays singleton. */
  newFlows: FlowState[];
  /** Chevron A — collapse entire client group (header + context + flow rows). */
  isCollapsed: boolean;
  /** Chevron B — collapse only the context panel. */
  isContextCollapsed: boolean;
}

export interface PlaygroundState {
  pageType: PageType | null;
  imageType: ImageType | null;
  clients: ClientState[];
  /** Monotonically-increasing ID counter stored in state — avoids StrictMode double-invoke. */
  nextClientId: number;
  /** ID of the most recently added client (used to scroll it into view). */
  lastAddedClientId: string | null;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeEmptyStepState(): StepState {
  return {
    inputs: {},
    inputOverrides: {},
    output: "",
    lastRunOutput: "",
    status: "idle",
    error: undefined,
    isOutputOverride: false,
  };
}

function makeEmptyFlowState(pipeline: PipelineDefinition): FlowState {
  const stepStates: Record<string, StepState> = {};
  for (const step of pipeline.steps) {
    stepStates[step.name] = makeEmptyStepState();
  }
  return { stepStates };
}

function makeDefaultContext(pipeline: PipelineDefinition): Record<string, string> {
  const ctx: Record<string, string> = {};
  for (const field of pipeline.clientContextFields) {
    ctx[field.name] = field.default ?? "";
  }
  return ctx;
}

function makeNewClient(
  pipeline: PipelineDefinition | null,
  id: string,
  name: string
): ClientState {
  const empty: FlowState = { stepStates: {} };
  return {
    id,
    name,
    context: pipeline ? makeDefaultContext(pipeline) : {},
    oldFlow: pipeline ? makeEmptyFlowState(pipeline) : empty,
    newFlows: [pipeline ? makeEmptyFlowState(pipeline) : empty],
    isCollapsed: false,
    isContextCollapsed: false,
  };
}

function getPipeline(
  pageType: PageType | null,
  imageType: ImageType | null
): PipelineDefinition | null {
  if (!pageType || !imageType) return null;
  return PIPELINES[`${pageType}:${imageType}`] ?? null;
}

function reinitClient(client: ClientState, pipeline: PipelineDefinition): ClientState {
  // Preserve the number of "New" lanes across pipeline switches — the user
  // likely wants to keep comparing N variants, even if inner state is wiped.
  const laneCount = Math.max(1, client.newFlows?.length ?? 1);
  return {
    ...client,
    context: { ...makeDefaultContext(pipeline), ...client.context },
    oldFlow: makeEmptyFlowState(pipeline),
    newFlows: Array.from({ length: laneCount }, () => makeEmptyFlowState(pipeline)),
  };
}

function updateClient(
  state: PlaygroundState,
  clientId: string,
  updater: (c: ClientState) => ClientState
): PlaygroundState {
  return {
    ...state,
    clients: state.clients.map((c) => (c.id === clientId ? updater(c) : c)),
  };
}

function safeParseJson(raw: string): unknown {
  try { return JSON.parse(raw); } catch { return null; }
}

function updateFlowStep(
  flow: FlowState,
  stepName: string,
  updater: (s: StepState) => StepState
): FlowState {
  const existing = flow.stepStates[stepName] ?? makeEmptyStepState();
  return {
    ...flow,
    stepStates: { ...flow.stepStates, [stepName]: updater(existing) },
  };
}

/** Dispatch a step-state update to either `oldFlow` or a specific
 *  `newFlows[flowIndex]` lane, based on the action's flowType/flowIndex. */
function updateTargetFlow(
  client: ClientState,
  flowType: "old" | "new",
  flowIndex: number | undefined,
  stepName: string,
  updater: (s: StepState) => StepState
): ClientState {
  if (flowType === "old") {
    return { ...client, oldFlow: updateFlowStep(client.oldFlow, stepName, updater) };
  }
  const idx = flowIndex ?? 0;
  return {
    ...client,
    newFlows: client.newFlows.map((f, i) =>
      i === idx ? updateFlowStep(f, stepName, updater) : f
    ),
  };
}

// ---------------------------------------------------------------------------
// Action types
// ---------------------------------------------------------------------------

export interface ImportedClientSeed {
  name: string;
  context: Record<string, string>;
  /** Optional: pre-populate Step 1 (scrape_client_site) output in newFlow. */
  scrapeSeed?: {
    markdown: string;
    branding: Record<string, unknown> | string;
    metadata?: Record<string, unknown> | string;
  };
}

export type PlaygroundAction =
  | { type: "SELECT_PAGE_TYPE"; pageType: PageType }
  | { type: "SELECT_IMAGE_TYPE"; imageType: ImageType }
  | { type: "ADD_CLIENT" }
  | { type: "IMPORT_CLIENTS"; seeds: ImportedClientSeed[] }
  | { type: "REMOVE_CLIENT"; clientId: string }
  | { type: "UPDATE_CLIENT_NAME"; clientId: string; name: string }
  | { type: "UPDATE_CLIENT_CONTEXT"; clientId: string; field: string; value: string }
  | { type: "TOGGLE_CLIENT_COLLAPSE"; clientId: string }
  | { type: "TOGGLE_CLIENT_CONTEXT_COLLAPSE"; clientId: string }
  | { type: "CLEAR_LAST_ADDED" }
  | {
      type: "UPDATE_STEP_INPUT";
      clientId: string;
      flowType: "old" | "new";
      /** For flowType "new", which lane (0 = original, 1 = "New 2", …). Ignored for "old". */
      flowIndex?: number;
      stepName: string;
      inputName: string;
      value: string;
    }
  | {
      /** Fix 2: Clear the manual override for a specific input field. */
      type: "RESET_STEP_INPUT_OVERRIDE";
      clientId: string;
      flowType: "old" | "new";
      /** For flowType "new", which lane (0 = original, 1 = "New 2", …). Ignored for "old". */
      flowIndex?: number;
      stepName: string;
      inputName: string;
    }
  | {
      /** User manually edited the output. Sets isOutputOverride = true. */
      type: "UPDATE_STEP_OUTPUT";
      clientId: string;
      flowType: "old" | "new";
      /** For flowType "new", which lane (0 = original, 1 = "New 2", …). Ignored for "old". */
      flowIndex?: number;
      stepName: string;
      output: string;
    }
  | {
      /** API returned a result. Clears isOutputOverride. */
      type: "SET_STEP_RUN_OUTPUT";
      clientId: string;
      flowType: "old" | "new";
      /** For flowType "new", which lane (0 = original, 1 = "New 2", …). Ignored for "old". */
      flowIndex?: number;
      stepName: string;
      output: string;
      /** Non-fatal server notice to surface alongside the output. */
      warning?: string;
    }
  | {
      type: "SET_STEP_STATUS";
      clientId: string;
      flowType: "old" | "new";
      /** For flowType "new", which lane (0 = original, 1 = "New 2", …). Ignored for "old". */
      flowIndex?: number;
      stepName: string;
      status: StepStatus;
    }
  | {
      type: "SET_STEP_ERROR";
      clientId: string;
      flowType: "old" | "new";
      /** For flowType "new", which lane (0 = original, 1 = "New 2", …). Ignored for "old". */
      flowIndex?: number;
      stepName: string;
      error: string;
    }
  | {
      type: "RESET_STEP";
      clientId: string;
      flowType: "old" | "new";
      flowIndex?: number;
      stepName: string;
    }
  | {
      /** Appends a new empty lane to client.newFlows. Old flow can't be multiplied. */
      type: "ADD_NEW_FLOW";
      clientId: string;
    }
  | {
      /** Removes a New lane. Index 0 (the default "New") can't be removed —
       *  reducer ignores the action in that case. */
      type: "REMOVE_NEW_FLOW";
      clientId: string;
      flowIndex: number;
    }
  | {
      /** Merges a partial stepConfig into the step's existing config. */
      type: "UPDATE_STEP_CONFIG";
      clientId: string;
      flowType: "old" | "new";
      flowIndex?: number;
      stepName: string;
      config: Record<string, unknown>;
    }
  | {
      /** Clears isOutputOverride and restores lastRunOutput. */
      type: "RESET_STEP_OVERRIDE";
      clientId: string;
      flowType: "old" | "new";
      /** For flowType "new", which lane (0 = original, 1 = "New 2", …). Ignored for "old". */
      flowIndex?: number;
      stepName: string;
    }
  | {
      /** Stores an edited system+user prompt pair for this step. */
      type: "SET_STEP_PROMPT_OVERRIDE";
      clientId: string;
      flowType: "old" | "new";
      /** For flowType "new", which lane (0 = original, 1 = "New 2", …). Ignored for "old". */
      flowIndex?: number;
      stepName: string;
      systemPrompt: string;
      userPrompt: string;
    }
  | {
      /** Clears any prompt override — subsequent runs use the template again. */
      type: "RESET_STEP_PROMPT_OVERRIDE";
      clientId: string;
      flowType: "old" | "new";
      /** For flowType "new", which lane (0 = original, 1 = "New 2", …). Ignored for "old". */
      flowIndex?: number;
      stepName: string;
    };

// ---------------------------------------------------------------------------
// Initial state — exactly 1 default client; counter at 2 for the next add.
// Direct initialization avoids React StrictMode double-invoke bugs.
// ---------------------------------------------------------------------------

export const initialState: PlaygroundState = {
  pageType: null,
  imageType: null,
  clients: [makeNewClient(null, "client_1", "Client 1")],
  nextClientId: 2,
  lastAddedClientId: null,
};

// ---------------------------------------------------------------------------
// Reducer
// ---------------------------------------------------------------------------

export function playgroundReducer(
  state: PlaygroundState,
  action: PlaygroundAction
): PlaygroundState {
  switch (action.type) {
    case "SELECT_PAGE_TYPE":
      return {
        ...state,
        pageType: action.pageType,
        imageType: null,
        clients: state.clients.map((c) => ({
          ...c,
          oldFlow: { stepStates: {} },
          newFlows: c.newFlows.map(() => ({ stepStates: {} })),
        })),
      };

    case "SELECT_IMAGE_TYPE": {
      const pipeline = getPipeline(state.pageType, action.imageType);
      return {
        ...state,
        imageType: action.imageType,
        clients: state.clients.map((c) => (pipeline ? reinitClient(c, pipeline) : c)),
      };
    }

    case "ADD_CLIENT": {
      const pipeline = getPipeline(state.pageType, state.imageType);
      const id = `client_${state.nextClientId}`;
      const name = `Client ${state.nextClientId}`;
      return {
        ...state,
        clients: [...state.clients, makeNewClient(pipeline, id, name)],
        nextClientId: state.nextClientId + 1,
        lastAddedClientId: id,
      };
    }

    case "IMPORT_CLIENTS": {
      const pipeline = getPipeline(state.pageType, state.imageType);
      if (!pipeline || action.seeds.length === 0) return state;

      let nextId = state.nextClientId;
      const added: ClientState[] = action.seeds.map((seed) => {
        const id = `client_${nextId}`;
        const fallbackName = `Client ${nextId}`;
        nextId += 1;

        const base = makeNewClient(pipeline, id, seed.name.trim() || fallbackName);
        const mergedContext = {
          ...base.context,
          ...Object.fromEntries(
            Object.entries(seed.context).filter(([, v]) => v !== undefined)
          ),
        };

        let newFlows = base.newFlows;
        if (seed.scrapeSeed) {
          const bRaw = seed.scrapeSeed.branding;
          const bObj = typeof bRaw === "string" ? safeParseJson(bRaw) : bRaw;
          const mRaw = seed.scrapeSeed.metadata;
          const mObj = typeof mRaw === "string" ? safeParseJson(mRaw) : mRaw;
          const payload = JSON.stringify({
            branding: bObj ?? {},
            metadata: mObj ?? {},
            markdown: seed.scrapeSeed.markdown,
          });
          // Seed the primary lane (index 0) only.
          newFlows = newFlows.map((f, i) =>
            i === 0
              ? updateFlowStep(f, "scrape_client_site", (s) => ({
                  ...s,
                  output: payload,
                  lastRunOutput: payload,
                  status: "completed",
                  isOutputOverride: false,
                  error: undefined,
                }))
              : f
          );
        }

        return { ...base, context: mergedContext, newFlows };
      });

      return {
        ...state,
        clients: [...state.clients, ...added],
        nextClientId: nextId,
        lastAddedClientId: added[added.length - 1]?.id ?? state.lastAddedClientId,
      };
    }

    case "REMOVE_CLIENT":
      return {
        ...state,
        clients: state.clients.filter((c) => c.id !== action.clientId),
        lastAddedClientId:
          state.lastAddedClientId === action.clientId ? null : state.lastAddedClientId,
      };

    case "UPDATE_CLIENT_NAME":
      return updateClient(state, action.clientId, (c) => ({ ...c, name: action.name }));

    case "UPDATE_CLIENT_CONTEXT":
      return updateClient(state, action.clientId, (c) => ({
        ...c,
        context: { ...c.context, [action.field]: action.value },
      }));

    case "TOGGLE_CLIENT_COLLAPSE":
      return updateClient(state, action.clientId, (c) => ({
        ...c,
        isCollapsed: !c.isCollapsed,
      }));

    case "TOGGLE_CLIENT_CONTEXT_COLLAPSE":
      return updateClient(state, action.clientId, (c) => ({
        ...c,
        isContextCollapsed: !c.isContextCollapsed,
      }));

    case "CLEAR_LAST_ADDED":
      return { ...state, lastAddedClientId: null };

    // Fix 2: mark this specific input as manually overridden
    case "UPDATE_STEP_INPUT":
      return updateClient(state, action.clientId, (c) =>
        updateTargetFlow(c, action.flowType, action.flowIndex, action.stepName, (s) => ({
          ...s,
          inputs: { ...s.inputs, [action.inputName]: action.value },
          inputOverrides: { ...s.inputOverrides, [action.inputName]: true },
        }))
      );

    // Fix 2: clear the override for a specific input
    case "RESET_STEP_INPUT_OVERRIDE":
      return updateClient(state, action.clientId, (c) =>
        updateTargetFlow(c, action.flowType, action.flowIndex, action.stepName, (s) => ({
          ...s,
          inputs: { ...s.inputs, [action.inputName]: "" },
          inputOverrides: { ...s.inputOverrides, [action.inputName]: false },
        }))
      );

    // User manually edited the output → isOutputOverride = true
    case "UPDATE_STEP_OUTPUT":
      return updateClient(state, action.clientId, (c) =>
        updateTargetFlow(c, action.flowType, action.flowIndex, action.stepName, (s) => ({
          ...s,
          output: action.output,
          status: "completed",
          isOutputOverride: true,
          error: undefined,
        }))
      );

    // API returned a result → store in output + lastRunOutput, clear override
    case "SET_STEP_RUN_OUTPUT":
      return updateClient(state, action.clientId, (c) =>
        updateTargetFlow(c, action.flowType, action.flowIndex, action.stepName, (s) => ({
          ...s,
          output: action.output,
          lastRunOutput: action.output,
          status: "completed",
          isOutputOverride: false,
          error: undefined,
          warning: action.warning,
        }))
      );

    case "SET_STEP_STATUS":
      return updateClient(state, action.clientId, (c) =>
        updateTargetFlow(c, action.flowType, action.flowIndex, action.stepName, (s) => ({
          ...s,
          status: action.status,
          ...(action.status === "running" ? { error: undefined, warning: undefined } : {}),
        }))
      );

    case "SET_STEP_ERROR":
      return updateClient(state, action.clientId, (c) =>
        updateTargetFlow(c, action.flowType, action.flowIndex, action.stepName, (s) => ({
          ...s,
          status: "failed",
          error: action.error,
        }))
      );

    case "RESET_STEP":
      return updateClient(state, action.clientId, (c) =>
        updateTargetFlow(c, action.flowType, action.flowIndex, action.stepName, () => makeEmptyStepState())
      );

    // Restore lastRunOutput, clear isOutputOverride
    case "RESET_STEP_OVERRIDE":
      return updateClient(state, action.clientId, (c) =>
        updateTargetFlow(c, action.flowType, action.flowIndex, action.stepName, (s) => ({
          ...s,
          output: s.lastRunOutput,
          isOutputOverride: false,
        }))
      );

    case "SET_STEP_PROMPT_OVERRIDE":
      return updateClient(state, action.clientId, (c) =>
        updateTargetFlow(c, action.flowType, action.flowIndex, action.stepName, (s) => ({
          ...s,
          promptOverride: {
            systemPrompt: action.systemPrompt,
            userPrompt: action.userPrompt,
          },
        }))
      );

    case "RESET_STEP_PROMPT_OVERRIDE":
      return updateClient(state, action.clientId, (c) =>
        updateTargetFlow(c, action.flowType, action.flowIndex, action.stepName, (s) => {
          const next = { ...s };
          delete next.promptOverride;
          return next;
        })
      );

    case "ADD_NEW_FLOW": {
      const pipeline = getPipeline(state.pageType, state.imageType);
      if (!pipeline) return state;
      return updateClient(state, action.clientId, (c) => ({
        ...c,
        newFlows: [...c.newFlows, makeEmptyFlowState(pipeline)],
      }));
    }

    case "UPDATE_STEP_CONFIG":
      return updateClient(state, action.clientId, (c) =>
        updateTargetFlow(c, action.flowType, action.flowIndex, action.stepName, (s) => ({
          ...s,
          stepConfig: { ...(s.stepConfig ?? {}), ...action.config },
        }))
      );

    case "REMOVE_NEW_FLOW": {
      // Guardrail: never delete the default lane (index 0).
      if (action.flowIndex <= 0) return state;
      return updateClient(state, action.clientId, (c) => {
        if (action.flowIndex >= c.newFlows.length) return c;
        return {
          ...c,
          newFlows: c.newFlows.filter((_, i) => i !== action.flowIndex),
        };
      });
    }

    default:
      return state;
  }
}
