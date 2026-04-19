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
  /** Fix 2: renamed from isManualOverride. True when user edited the output manually. */
  isOutputOverride: boolean;
  /** When set, both system + user prompts are sent literally (no template interpolation). */
  promptOverride?: PromptOverride;
}

export interface FlowState {
  stepStates: Record<string, StepState>;
}

export interface ClientState {
  id: string;
  name: string;
  context: Record<string, string>;
  oldFlow: FlowState;
  newFlow: FlowState;
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
    newFlow: pipeline ? makeEmptyFlowState(pipeline) : empty,
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
  return {
    ...client,
    context: { ...makeDefaultContext(pipeline), ...client.context },
    oldFlow: makeEmptyFlowState(pipeline),
    newFlow: makeEmptyFlowState(pipeline),
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

// ---------------------------------------------------------------------------
// Action types
// ---------------------------------------------------------------------------

export type PlaygroundAction =
  | { type: "SELECT_PAGE_TYPE"; pageType: PageType }
  | { type: "SELECT_IMAGE_TYPE"; imageType: ImageType }
  | { type: "ADD_CLIENT" }
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
      stepName: string;
      inputName: string;
      value: string;
    }
  | {
      /** Fix 2: Clear the manual override for a specific input field. */
      type: "RESET_STEP_INPUT_OVERRIDE";
      clientId: string;
      flowType: "old" | "new";
      stepName: string;
      inputName: string;
    }
  | {
      /** User manually edited the output. Sets isOutputOverride = true. */
      type: "UPDATE_STEP_OUTPUT";
      clientId: string;
      flowType: "old" | "new";
      stepName: string;
      output: string;
    }
  | {
      /** API returned a result. Clears isOutputOverride. */
      type: "SET_STEP_RUN_OUTPUT";
      clientId: string;
      flowType: "old" | "new";
      stepName: string;
      output: string;
    }
  | {
      type: "SET_STEP_STATUS";
      clientId: string;
      flowType: "old" | "new";
      stepName: string;
      status: StepStatus;
    }
  | {
      type: "SET_STEP_ERROR";
      clientId: string;
      flowType: "old" | "new";
      stepName: string;
      error: string;
    }
  | { type: "RESET_STEP"; clientId: string; flowType: "old" | "new"; stepName: string }
  | {
      /** Clears isOutputOverride and restores lastRunOutput. */
      type: "RESET_STEP_OVERRIDE";
      clientId: string;
      flowType: "old" | "new";
      stepName: string;
    }
  | {
      /** Stores an edited system+user prompt pair for this step. */
      type: "SET_STEP_PROMPT_OVERRIDE";
      clientId: string;
      flowType: "old" | "new";
      stepName: string;
      systemPrompt: string;
      userPrompt: string;
    }
  | {
      /** Clears any prompt override — subsequent runs use the template again. */
      type: "RESET_STEP_PROMPT_OVERRIDE";
      clientId: string;
      flowType: "old" | "new";
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
          newFlow: { stepStates: {} },
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
      return updateClient(state, action.clientId, (c) => {
        const flowKey = action.flowType === "old" ? "oldFlow" : "newFlow";
        return {
          ...c,
          [flowKey]: updateFlowStep(c[flowKey], action.stepName, (s) => ({
            ...s,
            inputs: { ...s.inputs, [action.inputName]: action.value },
            inputOverrides: { ...s.inputOverrides, [action.inputName]: true },
          })),
        };
      });

    // Fix 2: clear the override for a specific input
    case "RESET_STEP_INPUT_OVERRIDE":
      return updateClient(state, action.clientId, (c) => {
        const flowKey = action.flowType === "old" ? "oldFlow" : "newFlow";
        return {
          ...c,
          [flowKey]: updateFlowStep(c[flowKey], action.stepName, (s) => ({
            ...s,
            inputs: { ...s.inputs, [action.inputName]: "" },
            inputOverrides: { ...s.inputOverrides, [action.inputName]: false },
          })),
        };
      });

    // User manually edited the output → isOutputOverride = true
    case "UPDATE_STEP_OUTPUT":
      return updateClient(state, action.clientId, (c) => {
        const flowKey = action.flowType === "old" ? "oldFlow" : "newFlow";
        return {
          ...c,
          [flowKey]: updateFlowStep(c[flowKey], action.stepName, (s) => ({
            ...s,
            output: action.output,
            status: "completed",
            isOutputOverride: true,
            error: undefined,
          })),
        };
      });

    // API returned a result → store in output + lastRunOutput, clear override
    case "SET_STEP_RUN_OUTPUT":
      return updateClient(state, action.clientId, (c) => {
        const flowKey = action.flowType === "old" ? "oldFlow" : "newFlow";
        return {
          ...c,
          [flowKey]: updateFlowStep(c[flowKey], action.stepName, (s) => ({
            ...s,
            output: action.output,
            lastRunOutput: action.output,
            status: "completed",
            isOutputOverride: false,
            error: undefined,
          })),
        };
      });

    case "SET_STEP_STATUS":
      return updateClient(state, action.clientId, (c) => {
        const flowKey = action.flowType === "old" ? "oldFlow" : "newFlow";
        return {
          ...c,
          [flowKey]: updateFlowStep(c[flowKey], action.stepName, (s) => ({
            ...s,
            status: action.status,
            ...(action.status === "running" ? { error: undefined } : {}),
          })),
        };
      });

    case "SET_STEP_ERROR":
      return updateClient(state, action.clientId, (c) => {
        const flowKey = action.flowType === "old" ? "oldFlow" : "newFlow";
        return {
          ...c,
          [flowKey]: updateFlowStep(c[flowKey], action.stepName, (s) => ({
            ...s,
            status: "failed",
            error: action.error,
          })),
        };
      });

    case "RESET_STEP":
      return updateClient(state, action.clientId, (c) => {
        const flowKey = action.flowType === "old" ? "oldFlow" : "newFlow";
        return {
          ...c,
          [flowKey]: updateFlowStep(c[flowKey], action.stepName, () => makeEmptyStepState()),
        };
      });

    // Restore lastRunOutput, clear isOutputOverride
    case "RESET_STEP_OVERRIDE":
      return updateClient(state, action.clientId, (c) => {
        const flowKey = action.flowType === "old" ? "oldFlow" : "newFlow";
        return {
          ...c,
          [flowKey]: updateFlowStep(c[flowKey], action.stepName, (s) => ({
            ...s,
            output: s.lastRunOutput,
            isOutputOverride: false,
          })),
        };
      });

    case "SET_STEP_PROMPT_OVERRIDE":
      return updateClient(state, action.clientId, (c) => {
        const flowKey = action.flowType === "old" ? "oldFlow" : "newFlow";
        return {
          ...c,
          [flowKey]: updateFlowStep(c[flowKey], action.stepName, (s) => ({
            ...s,
            promptOverride: {
              systemPrompt: action.systemPrompt,
              userPrompt: action.userPrompt,
            },
          })),
        };
      });

    case "RESET_STEP_PROMPT_OVERRIDE":
      return updateClient(state, action.clientId, (c) => {
        const flowKey = action.flowType === "old" ? "oldFlow" : "newFlow";
        return {
          ...c,
          [flowKey]: updateFlowStep(c[flowKey], action.stepName, (s) => {
            const next = { ...s };
            delete next.promptOverride;
            return next;
          }),
        };
      });

    default:
      return state;
  }
}
