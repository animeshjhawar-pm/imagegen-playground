// ===========================================================================
// Auto-generated from prod `gw_stormbreaker` DB on 2026-04-19.
// 10 real client projects — their design_tokens, company_info, logo_urls,
// service_catalog, product_information, and a sample paa_data + topics.
// Powers the Import Client Dialog "Preset" picker so the real stormbreaker
// prompts (SERVICE_PAGE_CONTENT_GEN, CATEGORY_PAGE_CONTENT_GEN, etc.) run
// against realistic per-client inputs.
// ===========================================================================

export interface ClientSample {
  id: string;
  slug: string;
  name: string;
  url: string;
  /** Stringified JSON of the project's design_tokens jsonb column. */
  designTokensJson: string;
  /** Stringified JSON of company_info. */
  companyInfoJson: string;
  /**
   * Project `additional_info` column — surfaced in the playground as
   * `business_context`. Paste the raw value straight from the DB (may be
   * JSON-stringified or plain text). Leave `""` if the row has no value.
   */
  additionalInfoJson: string;
  /** Stringified JSON of logo_urls. Contains primary_logo + favicon + gbp_url. */
  logoUrlsJson: string;
  /** Direct URL of primary_logo for quick use as Replicate image_input. */
  primaryLogoUrl: string;
  /** Stringified JSON array of service resources (up to 10). */
  serviceCatalogJson: string;
  /** Stringified JSON array of product resources (up to 20). */
  productInformationJson: string;
  /** Stringified JSON of an example paa_data blob for one cluster, if any. */
  paaDataJson: string;
  sampleServiceTopic: string;
  sampleCategoryTopic: string;
  sampleBlogTopic: string;
}

const CLIENT_ALLCARE_MEDICAL_TRANSPORT: ClientSample = {
  id: `674499ea-6108-423e-850b-6e3988528daa`,
  slug: `allcare-medical-transport`,
  name: `AllCare Medical Transport`,
  url: `https://allcaremedicaltransport.com/`,
  primaryLogoUrl: `https://file-host.link/website/allcaremedicaltransport-zjjfwo/assets/logo/logo.webp`,
  sampleServiceTopic: `Affordable Medical Transportation - Senior Living Apartments in Orlando, FL`,
  sampleCategoryTopic: ``,
  sampleBlogTopic: `Wheelchair Requirements for Bus Transportation: Complete Guide`,
  designTokensJson: `{
  "fonts": {
    "body_font_url": "https://fonts.googleapis.com/css2?family=Inter:wght@300..700&display=swap",
    "heading_font_url": "https://fonts.googleapis.com/css2?family=Urbanist:wght@300..700&display=swap"
  },
  "css_variables": {
    "--color-brand-text": "#0a1a22",
    "--font-family-body": "Inter, ui-sans-serif, system-ui, sans-serif",
    "--color-brand-primary": "#025F89",
    "--font-family-heading": "Urbanist, ui-sans-serif, system-ui, sans-serif",
    "--color-brand-secondary": "#3BAFBF",
    "--color-brand-text-muted": "#6b8f9e",
    "--color-brand-primary-dark": "#013a54",
    "--color-brand-text-inverse": "#ffffff",
    "--color-brand-text-primary": "#0a1a22",
    "--color-brand-primary-hover": "#024d70",
    "--color-brand-primary-light": "rgba(2, 95, 137, 0.05)",
    "--color-brand-text-tertiary": "#3BAFBF",
    "--color-brand-primary-medium": "rgba(2, 95, 137, 0.1)",
    "--color-brand-secondary-dark": "#237f8c",
    "--color-brand-text-secondary": "#1e4a5c",
    "--color-brand-secondary-hover": "#2e9aaa",
    "--color-brand-secondary-light": "rgba(59, 175, 191, 0.05)",
    "--color-brand-secondary-medium": "rgba(59, 175, 191, 0.1)",
    "--color-brand-primary-foreground": "#ffffff",
    "--color-brand-secondary-foreground": "#ffffff"
  }
}`,
  companyInfoJson: `{
  "name": {
    "dba_name": "AllCare Medical Transport",
    "legal_name": "All Care Medical Transport",
    "company_name": "Coastal Care Medical Transport"
  },
  "founded": {
    "founded_date_year": 2010,
    "years_in_business": "16 years"
  },
  "locations": {
    "branch_locations": [],
    "headquarters_address": "Palm Coast, Florida"
  },
  "credentials": {
    "memberships": [
      "Approved vendor"
    ],
    "accreditations": [],
    "certifications": [
      "CPR/First Aid Certified",
      "PASS (wheelchair and stretcher certification)"
    ],
    "business_licenses": [
      "Fully licensed for medical transport in Florida"
    ]
  },
  "company_size": {
    "employee_count": null,
    "annual_turnover": null
  },
  "service_team": {
    "team_members": [
      {
        "bio": "After teaching and working as a counselor for 23 years, Lisa decided to make a change in her career. After taking care of her grandmother and father while they were sick, she realized something was missing in the transportation world. Lisa always had a desire to work with Senior citizens and medical transportation has provided that opportunity. Since 2010, Lisa and her husband Tim have worked in Alachua and Flagler counties to provide customer service that every family deserves.",
        "name": "Lisa P. Hogan",
        "title": "Owner",
        "headshot_image": null
      },
      {
        "bio": "Since 2010, Tim and his wife Lisa have worked in Alachua and Flagler counties to provide customer service that every family deserves-treating your family like their family.",
        "name": "Tim Hogan",
        "title": "Co-Owner",
        "headshot_image": null
      }
    ],
    "employee_count": null,
    "years_of_experience": null
  },
  "company_story": {
    "milestones": [
      "2010: Company founded by Lisa P. Hogan and husband Tim"
    ],
    "founding_story": "After teaching and working as a counselor for 23 years, Lisa P. Hogan decided to make a change in her career. After taking care of her grandmother and father while they were sick, she realized something was missing in the transportation world. Family members should not be afraid to travel with a company. Lisa always had a desire to work with Senior citizens and medical transportation has provided that opportunity.",
    "company_history": "Since 2010, Lisa and her husband Tim have worked in Alachua and Flagler counties to provide customer service that every family deserves. The company is based in the Palm Coast, Florida area and provides non-emergency medical transports in Florida and across the nation.",
    "growth_narrative": "The company expanded from serving Alachua County to Flagler County and surrounding areas, building a reputation for treating clients' families like their own family while maintaining the highest safety standards."
  },
  "phone_numbers": [
    "+1 386-864-7145",
    "(904) 342-7338",
    "386-864-7145"
  ],
  "service_areas": [
    "Florida",
    "Flagler County",
    "Palm Coast",
    "St. Augustine",
    "Daytona",
    "Alachua County"
  ],
  "working_hours": {
    "Friday": [
      "Open 24 hours"
    ],
    "Monday": [
      "Open 24 hours"
    ],
    "Sunday": [
      "Open 24 hours"
    ],
    "Tuesday": [
      "Open 24 hours"
    ],
    "Saturday": [
      "Open 24 hours"
    ],
    "Thursday": [
      "Open 24 hours"
    ],
    "Wednesday": [
      "Open 24 hours"
    ]
  },
  "email_addresses": [
    "info@allcaremedicaltransport.com",
    "contact@allcaremedicaltransport.com"
  ],
  "major_customers": [],
  "ratings_reviews": {
    "GBP": {
      "rating": 4.8,
      "review_count": 57
    }
  },
  "business_category": [
    "Ambulance service",
    "Transportation service",
    "Handicapped transportation service"
  ],
  "value_propositions": {
    "key_benefits": [
      "Reliable transportation services for special needs",
      "Customer service that every family deserves",
      "Most up to date, safety oriented transportation available",
      "Transportation to and from medical and non-medical occasions"
    ],
    "market_positioning": "A family-oriented, safety-first non-emergency medical transportation provider serving Florida with local and long-distance transport capabilities",
    "competitive_advantages": [
      "Available 24 hours a day, 7 days a week",
      "Approved vendor status",
      "Fully licensed and insured with commercial and general liability policy",
      "All employees pass drug tests, DOT physical, national and local background checks",
      "CPR/First Aid Certified staff",
      "PASS certified (wheelchair and stretcher certification)"
    ],
    "unique_selling_propositions": [
      "Extension of the facilities that we serve",
      "Fast-response, service-oriented company",
      "Enhanced fleet of vehicles for comprehensive transport options"
    ]
  },
  "awards_recognitions": [],
  "social_media_profiles": {
    "other": [],
    "yelp_url": null,
    "twitter_url": null,
    "youtube_url": null,
    "facebook_url": null,
    "linkedin_url": null,
    "whatsapp_url": null,
    "instagram_url": null
  },
  "target_customer_segments": [
    "Senior citizens",
    "Individuals with special transportation needs",
    "Physically and mentally challenged individuals",
    "Families requiring medical transport services",
    "Healthcare facilities",
    "Hospice patients",
    "Hospital discharge patients"
  ],
  "mission_statement_company_values": {
    "vision": null,
    "taglines": [
      "Non-Emergency Medical Transport Across Florida and Beyond"
    ],
    "core_values": [
      "Building relationships with customers",
      "Treating your family like their family",
      "Safety First",
      "Respect and courtesy for every client"
    ],
    "mission_statement": "To provide exceptional service and quality that will meet and exceed the expectations of our patrons"
  }
}`,
  additionalInfoJson: `{
  "business_profile": {
    "inventory_nature": "100% Transportation Services (no physical product inventory; service categories include ambulatory, wheelchair, and stretcher transport modes)",
    "business_identity": "Non-emergency medical transportation provider offering ambulatory, wheelchair, and stretcher transport services for local and long-distance trips in Florida and nationwide.",
    "primary_verticals": [
      "Medical Appointment Transportation",
      "Hospital Discharge Transportation",
      "Dialysis Transportation",
      "Rehabilitation & Therapy Transportation",
      "Non-Medical Event Transportation"
    ],
    "explicit_out_of_scope": [
      "Emergency Medical Services",
      "Ambulance Emergency Response",
      "Medical Equipment Sales",
      "Vehicle Sales or Rentals",
      "Healthcare Provider Services",
      "In-Home Care Services",
      "Medical Treatment or Clinical Services"
    ]
  }
}`,
  logoUrlsJson: `{
  "favicon": "https://file-host.link/website/allcaremedicaltransport-zjjfwo/assets/logo/1775114817091897_d592a48b14ca40c09d633325a019a741.jpg",
  "gbp_url": "https://file-host.link/website/allcaremedicaltransport-zjjfwo/assets/logo/1775114725352566_742b16271616432f814899a8957d2723.webp",
  "primary_logo": "https://file-host.link/website/allcaremedicaltransport-zjjfwo/assets/logo/logo.webp"
}`,
  serviceCatalogJson: `[
  {
    "name": "Ambulatory Transportation",
    "details": {
      "availability": "24 hours a day, 7 days a week",
      "service_name": "Ambulatory Transportation",
      "pricing_offers": "[\\n    \\"Not specified\\"\\n]",
      "service_description": "Non-emergency transport for individuals who are able to walk on their own with driver's assistance. This service is part of the full array of non-emergency medical transportation services offered for the physically and mentally challenged. With Focus on areas such as Flagler County, Palm Coast, St. Augustine, Daytona, Volusia, County, St. John's County, Putnam, Seminole County, Orange County, Orlando, New Smyrna Beach, Deland, Sanford, Palatka, Gainesville and Deltona. "
    }
  },
  {
    "name": "Stretcher Transportation",
    "details": {
      "availability": "24 hours a day, 7 days a week",
      "service_name": "Stretcher Transportation",
      "pricing_offers": "[\\n    \\"Not specified\\"\\n]",
      "service_description": "Non-emergency stretcher transportation is intended for use by individuals who are unable to sit upright for medical or comfort reasons. This service is part of the full array of non-emergency medical transportation services offered for the physically and mentally challenged.With Focus on areas such as Flagler County, Palm Coast, St. Augustine, Daytona, Volusia, County, St. John's County, Putnam, Seminole County, Orange County, Orlando, New Smyrna Beach, Deland, Sanford, Palatka, Gainesville and Deltona. "
    }
  },
  {
    "name": "Wheelchair Transportation",
    "details": {
      "availability": "24 hours a day, 7 days a week",
      "service_name": "Wheelchair Transportation",
      "pricing_offers": "[\\n    \\"Not specified\\"\\n]",
      "service_description": "Wheelchair transport vehicles are staffed by one medical transport specialist trained in the sensitivity to the physical needs of the client. This mode of transportation is designed for non-ambulatory persons who are able to sit upright in a wheelchair. This service is part of the full array of non-emergency medical transportation services offered for the physically and mentally challenged.With Focus on areas such as Flagler County, Palm Coast, St. Augustine, Daytona, Volusia, County, St. John's County, Putnam, Seminole County, Orange County, Orlando, New Smyrna Beach, Deland, Sanford, Palatka, Gainesville and Deltona. "
    }
  },
  {
    "name": "Long Distance Transportation",
    "details": {
      "availability": "24 hours a day, 7 days a week",
      "service_name": "Long Distance Transportation",
      "pricing_offers": "[\\n    \\"FREE quote available by calling (386)864.7145\\"\\n]",
      "service_description": "AllCare Medical Transport provides licensed and insured non-emergency medical transportation for individuals and families with special transportation needs across the state of Florida, with a special focus on Flagler County, Palm Coast, St. Augustine, Daytona, Volusia, County, St. John's County, Putnam, Seminole County, Orange County, Orlando, New Smyrna Beach, Deland, Sanford, Palatka, Gainesville and Deltona. The service offers Wheelchair, Stretcher, and Ambulance transportation. Transportation is provided to and from: All Medical Appointments, Doctor Appointments, Non-Emergency Hospital Visits, Hospital Discharge, Dialysis, X-ray and Radiation visits, Stroke Rehabilitation, Occupational and Physical Therapy treatments, Pulmonary and Cardiac Rehabilitation, Dental Appointments, Non-Medical Occasions, Long Distance Trips, Airports, Train or Bus stations, Games, Special and family events. The company is a fast-response, service-oriented company committed to ensuring every client is treated with respect and courtesy."
    }
  },
  {
    "name": "Local Transportation",
    "details": {
      "availability": "24 hours a day, 7 days a week",
      "service_name": "Local Transportation",
      "pricing_offers": "[\\n    \\"Not specified\\"\\n]",
      "service_description": "AllCare Medical Transport provides licensed and insured non-emergency medical transportation for individuals and families with special transportation needs across the state of Florida, with a special focus on Flagler County, Palm Coast, St. Augustine, Daytona, Volusia, County, St. John's County, Putnam, Seminole County, Orange County, Orlando, New Smyrna Beach, Deland, Sanford, Palatka, Gainesville and Deltona. The service offers Wheelchair, Stretcher, and Ambulance transportation. Transportation is provided to and from: All Medical Appointments, Doctor Appointments, Non-Emergency Hospital Visits, Hospital Discharge, Dialysis, X-ray and Radiation visits, Stroke Rehabilitation, Occupational and Physical Therapy treatments, Pulmonary and Cardiac Rehabilitation, Dental Appointments, Non-Medical Occasions, Long Distance Trips, Airports, Train or Bus stations, Games, Special and family events. The company is a fast-response, service-oriented company committed to ensuring every client is treated with respect and courtesy."
    }
  }
]`,
  productInformationJson: `[]`,
  paaDataJson: `[
  "What is the most requested support service for the elderly?"
]`,
};

const CLIENT_EVOK_POLYMERS: ClientSample = {
  id: `85a98689-6d14-46bb-b485-a2a2f082451c`,
  slug: `evok-polymers`,
  name: `Evok Polymers`,
  url: `https://evokpoly.com/`,
  primaryLogoUrl: `https://file-host.link/website/evokpoly-4i0bqo/assets/logo/logo.webp`,
  sampleServiceTopic: `Reaction Injection Molding (RIM) Services | Large Part Solutions`,
  sampleCategoryTopic: ``,
  sampleBlogTopic: `The Hidden Math Behind Injection Molding Shrinkage: How to Predict and Control It`,
  designTokensJson: `{
  "fonts": {
    "body_font_url": "https://fonts.googleapis.com/css2?family=Inter:wght@300..700&display=swap",
    "heading_font_url": "https://fonts.googleapis.com/css2?family=Urbanist:wght@300..700&display=swap"
  },
  "css_variables": {
    "--color-brand-text": "#171717",
    "--font-family-body": "Inter, ui-sans-serif, system-ui, sans-serif",
    "--color-brand-primary": "#000000",
    "--font-family-heading": "Urbanist, ui-sans-serif, system-ui, sans-serif",
    "--color-brand-secondary": "#3b82f6",
    "--color-brand-text-muted": "#a3a3a3",
    "--color-brand-primary-dark": "#000000",
    "--color-brand-text-inverse": "#ffffff",
    "--color-brand-text-primary": "#0a0a0a",
    "--color-brand-primary-hover": "#1a1a1a",
    "--color-brand-primary-light": "rgba(0, 0, 0, 0.05)",
    "--color-brand-text-tertiary": "#737373",
    "--color-brand-primary-medium": "rgba(0, 0, 0, 0.1)",
    "--color-brand-secondary-dark": "#1e40af",
    "--color-brand-text-secondary": "#404040",
    "--color-brand-secondary-hover": "#2563eb",
    "--color-brand-secondary-light": "rgba(59, 130, 246, 0.05)",
    "--color-brand-secondary-medium": "rgba(59, 130, 246, 0.1)",
    "--color-brand-primary-foreground": "#ffffff",
    "--color-brand-secondary-foreground": "#ffffff"
  }
}`,
  companyInfoJson: `{
  "name": {
    "dba_name": "EVOK",
    "legal_name": null,
    "company_name": "Evok Polymers"
  },
  "founded": {
    "founded_date_year": null,
    "years_in_business": "25 years"
  },
  "locations": {
    "branch_locations": [],
    "headquarters_address": "940 Madison Ave New York, NY 10021"
  },
  "credentials": {
    "memberships": [
      "Allied Executives Business Leadership Peer group",
      "Institute of Packaging Professionals"
    ],
    "accreditations": [],
    "certifications": [
      "Six Sigma black belt"
    ],
    "business_licenses": []
  },
  "company_size": {
    "employee_count": null,
    "annual_turnover": null
  },
  "service_team": {
    "team_members": [
      {
        "bio": "Paul Dathe has a passion for helping people with manufacturing of plastic parts. He founded Evōk Polymers with the goal of supplying customers with the highest quality injection molded components at the lowest possible price, using proprietary technology, deep industry knowledge, and white-glove customer service. Paul has over 25 years of experience in engineering, product design, sales, with a specialization in solving problems in injection molding custom plastic components. Prior to founding Evok, Paul led new product development for Caliber Products, an industry leader in powersports, where he designed, developed, and launched 13 new products. He grew sales 540% and customers from 25 to 144 with 100% client retention. He led tooling, functional assessments, proof of concepts, 3D modelling, prototype fabrication, testing qualifications, tolerance analysis, and mold flow studies of all new products. Previously, Paul served as senior mechanical engineer for Entegris, where he was responsible for a $40 million product line of ultra clean liquid delivery systems used in semiconductor and flat panel TV high purity chemical applications. Paul began his career at Rollerblade as a design and prototype engineer before serving as senior packaging and prototype engineer at General Mills and Boston Scientific. Paul holds four U.S. utility patents, is a Six Sigma black belt, and received a Bachelor of Science degree in Mechanical Design from Bemidji State University with an emphasis in rapid prototyping and 3D computer modelling. He is a member of Allied Executives Business Leadership Peer group and the Institute of Packaging Professionals.",
        "name": "Paul Dathe",
        "title": "Founder",
        "headshot_image": "https://evokpoly.com/wp-content/uploads/2021/07/Paul-at-show-300x121.png"
      },
      {
        "bio": "Jason is a seasoned industrial designer with a passion for creating innovative and functional products. He finds fulfillment beyond his professional endeavors within a multi-generational household. Living with his wife, two sons, and mother, nurtures his innate empathy, influencing his design approach as he keenly observes human behavior. In his leisure time, Jason enjoys indulging in his passions for cooking, gaming, and unwinding.",
        "name": "Jason Weber",
        "title": "Industrial Designer",
        "headshot_image": null
      },
      {
        "bio": "Shawn is ever curious and has been a vital creative force on some of the most advanced seating projects of the last two decades. He is particularly adept at graphically and physically communicating evolving design concepts and part features, he does this by building complex mechanical and visual prototypes in a variety of materials. He creates photorealistic renderings for clients in Otoy OctaneRender® and develops layouts, diagrams and logos with the Adobe Creative Cloud. Shawn has been instrumental in finding mechanical molded part solutions that can be prototyped and confirmed prior to going to tooling. His involvement on pre-molding design reviews has reduced risk in many recent large scale projects. Shawn holds several patents and has conducted research on all sorts of projects that range from consumer lawn mower products to biotech and medical facilities. Outside of work, he practices photography and is often found enjoying the vibrant Twin Cities live music scene.",
        "name": "Shawn Monitor",
        "title": "Sr. Industrial Designer",
        "headshot_image": "https://evokpoly.com/wp-content/uploads/2024/04/ShawnMonitor_square-300x300.jpg"
      },
      {
        "bio": "Daniel's expertise in system and process design, coupled with his ability to cultivate strategic partnerships, sets him apart in the industry. His passion for innovation and collaboration shines through in his work, as he is dedicated to creating Lean Partnership-Based Organizations that empower small and mid-sized businesses. At Evok, he leads initiatives that challenge traditional norms in part design, prototyping, tooling, and injection mold part manufacturing. His vision goes beyond disruption; he aims to build a community centered on continuous improvement, mutual benefit, and genuine partnership. Evok's commitment to transforming industry standards aligns perfectly with Daniel's drive for sustainable growth and innovation. Under his leadership, Evok is not only changing the game but also establishing a new benchmark for collaborative success. Daniel's proficiency as a facilitator, public speaker, teacher, and coach, combined with his talent for team building and mentorship, makes him an indispensable member of the Evok team.",
        "name": "Daniel D. Hoyt, Ph.D.",
        "title": "Business Development Manager",
        "headshot_image": "https://evokpoly.com/wp-content/uploads/2024/04/Danny-Hoyt-2-300x295.png"
      },
      {
        "bio": "Natalie, a dedicated apprentice in product design and management, embodies the harmonious blend of creativity and sustainability. Possessing an innate curiosity and a discerning eye for innovation, she tirelessly explores the junctures where design converges with environmental consciousness. Having been immersed in intangible design principles since childhood, Natalie grasps the profound impact products can wield on the planet. This early awareness, coupled with her education in sustainability, propels her commitment to infusing eco-consciousness into every facet of her work. Under the guidance of her father and seasoned professionals, Natalie delves deeply into the intricacies of product design, eagerly absorbing knowledge. She investigates a myriad of materials, manufacturing techniques, and technologies, always mindful of their ecological footprint. Natalie's journey extends far beyond the creation of aesthetically pleasing objects; she aspires to shape a future where design seamlessly intertwines with sustainability, leaving a positive legacy for generations to come.",
        "name": "Natalie Weber",
        "title": "Operations Officer – LIV",
        "headshot_image": "https://evokpoly.com/wp-content/uploads/2024/04/Nat2-5-300x300.jpg"
      },
      {
        "bio": "Julie has been with Evok since its inception. As an experienced bookkeeper, she brings meticulous attention to detail with a thorough understanding of financial principles to efficiently manage and maintain accurate financial records for the Evok business. With a background in accounting and a keen eye for numbers, Julie excels in organizing and categorizing transactions, reconciling accounts, and producing clear and concise financial reports. Julie's proficiency in accounting software ensures streamlined processes and timely delivery of financial information, enabling businesses to make informed decisions and maintain compliance with regulatory requirements. Committed to professionalism and confidentiality, she is dedicated to providing reliable bookkeeping services that support the financial health and success of the team and customers. Julie makes sure all vendors get paid on time.",
        "name": "Julie Young",
        "title": "Accounting and Finance Manager",
        "headshot_image": "https://evokpoly.com/wp-content/uploads/2024/04/Julie-young-300x300.png"
      }
    ],
    "employee_count": 6,
    "years_of_experience": null
  },
  "company_story": {
    "milestones": [],
    "founding_story": "Paul Dathe founded Evōk Polymers with the goal of supplying customers with the highest quality injection molded components at the lowest possible price, using proprietary technology, deep industry knowledge, and white-glove customer service. The name Evōk, which means 'to bring to the conscious mind,' aims to inspire and connect partners with a new part development experience built on trust.",
    "company_history": "EVOK has teamed and will continue to team with the key leaders across the molding technology industry to offer a specific set of optimization tools to a wide range of applications for over 25 years. They have been providing OEMs with numerous advantages for custom plastic injection molded plastic parts and products.",
    "growth_narrative": "Prior to founding Evok, Paul Dathe led new product development for Caliber Products where he designed, developed, and launched 13 new products. He grew sales 540% and customers from 25 to 144 with 100% client retention."
  },
  "phone_numbers": [
    "+1 612-991-2001",
    "1.800.555.6789",
    "1-612-911-2001",
    "612-991-2001",
    "1-555-456-7890",
    "1.800.555.0000"
  ],
  "service_areas": [],
  "working_hours": {
    "Friday": [
      "8AM-9PM"
    ],
    "Monday": [
      "8AM-9PM"
    ],
    "Sunday": [
      "Closed"
    ],
    "Tuesday": [
      "8AM-9PM"
    ],
    "Saturday": [
      "Closed"
    ],
    "Thursday": [
      "8AM-9PM"
    ],
    "Wednesday": [
      "8AM-9PM"
    ]
  },
  "email_addresses": [],
  "major_customers": [
    {
      "customer_name": "Wave Armor",
      "customer_logo_url": "https://evokpoly.com/wp-content/uploads/2021/10/Wave-Armor.png"
    },
    {
      "customer_name": "Rollerblade",
      "customer_logo_url": "https://evokpoly.com/wp-content/uploads/2021/10/Rollerblade.png"
    },
    {
      "customer_name": "Polaris",
      "customer_logo_url": "https://evokpoly.com/wp-content/uploads/2021/10/Polaris.png"
    },
    {
      "customer_name": "Nautique",
      "customer_logo_url": "https://evokpoly.com/wp-content/uploads/2021/10/Nautique.png"
    },
    {
      "customer_name": "General Mills",
      "customer_logo_url": "https://evokpoly.com/wp-content/uploads/2021/10/General-Mills.png"
    },
    {
      "customer_name": "Entegris",
      "customer_logo_url": "https://evokpoly.com/wp-content/uploads/2021/10/Entegris.png"
    },
    {
      "customer_name": "Caliber",
      "customer_logo_url": "https://evokpoly.com/wp-content/uploads/2021/10/Caliber.png"
    },
    {
      "customer_name": "Alcom",
      "customer_logo_url": "https://evokpoly.com/wp-content/uploads/2021/10/Alcom.png"
    },
    {
      "customer_name": "Boston Scientific",
      "customer_logo_url": "https://evokpoly.com/wp-content/uploads/2021/09/Boston-Scientific.png"
    }
  ],
  "ratings_reviews": {
    "GBP": {
      "rating": 5,
      "review_count": 10
    }
  },
  "business_category": [
    "Manufacturer"
  ],
  "target_geographies": [
    "us"
  ],
  "value_propositions": {
    "key_benefits": [
      "Highest quality injection molded components at the lowest possible price",
      "Speed to market",
      "Low-cost production tool while minimizing cycle time",
      "Consideration of performance and cosmetics",
      "Helps save time and money",
      "Successful market delivery",
      "Cost reduced production parts"
    ],
    "market_positioning": "Best-in-class injection molding part design, development, and manufacturing partner focused on optimized efficiencies and deep customer connections to deliver jewelry quality at optimized price",
    "competitive_advantages": [
      "25 years of experience in injection molding",
      "Deep industry knowledge",
      "Team of problem solvers that strive to find optimal design features and part performance",
      "Cross-functional team efforts with continuous improvement mindset",
      "Very upfront with costs so customers can contribute to optimized design",
      "Passionate about itemizing and prioritizing cost structure related to manufactured parts"
    ],
    "unique_selling_propositions": [
      "Proprietary technology for injection molded components",
      "White-glove customer service",
      "Buyer-oriented marketplace business model",
      "Network of buyers driven to define a more efficient purchasing environment based on waste and open press time availability",
      "Collaboration with Studio Weber and Associates on compliant mechanisms and dematerialization",
      "Hinj design approach organized around compliant mechanisms"
    ]
  },
  "awards_recognitions": [],
  "social_media_profiles": {
    "other": [],
    "yelp_url": null,
    "twitter_url": null,
    "youtube_url": null,
    "facebook_url": null,
    "linkedin_url": null,
    "whatsapp_url": null,
    "instagram_url": null
  },
  "target_customer_segments": [
    "OEMs (Original Equipment Manufacturers)",
    "Consumer product brands",
    "Powersports industry",
    "Semiconductor industry",
    "Flat panel TV industry",
    "Medical device manufacturers",
    "Packaging industry"
  ],
  "mission_statement_company_values": {
    "vision": "Evōk, which means, 'to bring to the conscious mind,' aims to inspire and connect our partners with a new part development experience built on trust.",
    "taglines": [
      "PASSION DRIVEN PARTS - experience jewelry quality at optimized price",
      "DEDICATED TO QUALITY - experience jewelry quality at optimized price",
      "THE FUTURE OF INJECTION MOLDING - streamline the product development process"
    ],
    "core_values": [
      "DEDICATION TO YOUR SUCCESS",
      "DEEP RELATIONSHIP BUILDING SO WE DELIVER PROFITABLE PARTS",
      "ALTERNATIVE SOLUTIONS THAT SOLVE PROBLEMS",
      "TRUST BASED ENVIRONMENT WHERE SHARING INCREASES PROGRESS"
    ],
    "mission_statement": "Evok Polymers is a best-in-class Injection molding part design, development, and manufacturing partner. We focus on a deep connection with our customers to develop optimized efficiencies with respect to Injection molded part design, material selection, tool development, and high volume optimized part pricing."
  }
}`,
  additionalInfoJson: `{
  "business_profile": {
    "inventory_nature": "100% Custom-Manufactured Components - No catalog inventory; all parts are designed and produced to customer specifications with production tooling for lifecycle supply.",
    "business_identity": "B2B injection molding partner specializing in custom plastic part design, mold development, and high-volume production manufacturing rather than off-the-shelf product sales.",
    "primary_verticals": [
      "Custom Injection Molded Parts",
      "Mold Design & Tooling",
      "CAD Engineering Services",
      "Rapid Prototyping (SLA/FDM)",
      "Material Selection & Testing"
    ],
    "explicit_out_of_scope": [
      "Off-the-shelf plastic parts or products",
      "Evaluation tooling or short-run tooling (focus is production tooling only)",
      "Mold repair services",
      "Rental equipment",
      "Metal fabrication or non-plastic materials",
      "Residential/consumer direct sales",
      "Pre-designed catalog components",
      "Tooling for non-injection processes (blow molding, thermoforming, etc.)"
    ]
  }
}`,
  logoUrlsJson: `{
  "favicon": "https://file-host.link/website/evokpoly-4i0bqo/assets/logo/1769971895557879_61cc5d1be37c43c4adcb83249bfd6b9f.png",
  "gbp_url": "https://file-host.link/website/evokpoly-4i0bqo/assets/logo/1769627909476151_22a1eb69ac9f47c3b1d9e302592b4d1d.webp",
  "primary_logo": "https://file-host.link/website/evokpoly-4i0bqo/assets/logo/logo.webp"
}`,
  serviceCatalogJson: `[
  {
    "name": "PROTOTYPE SERVICES",
    "details": {
      "availability": "Not specified",
      "service_name": "PROTOTYPE SERVICES",
      "pricing_offers": "[\\n    \\"$100-$300 PART depending on Prototype Size & System\\",\\n    \\"$100-$500/prototype\\"\\n]",
      "service_description": "Rapid prototype services to validate final design for structural and cosmetic verification. The service helps customers see their parts before committing to production tooling. Services include choosing the right rapid prototype process to advance design, with options for both cosmetic or functional prototypes. The company emphasizes the importance of seeing your part during the development process and offers guidance on selecting the right RP system. Prototype fabrication is part of their comprehensive product development pipeline."
    }
  },
  {
    "name": "Security & Access",
    "details": {
      "availability": "Week Days: 8:00 \\u2013 5:00, Saturday: 9:00 \\u2013 5:00, Sunday: 11:00 \\u2013 4:00",
      "service_name": "Security & Access",
      "pricing_offers": "[\\n    \\"Not specified\\"\\n]",
      "service_description": "Security and access control services as part of their service portfolio. The service includes security system installation and access control solutions."
    }
  },
  {
    "name": "PROTOTYPING",
    "details": {
      "availability": "Not specified",
      "service_name": "PROTOTYPING",
      "pricing_offers": "[\\n    \\"Not specified\\"\\n]",
      "service_description": "Prototyping services as part of their comprehensive injection molding solutions. Services include design iterations, product feature changes, and prototype fabrication for testing and validation. The company offers various prototyping methods to help customers validate designs before committing to production tooling."
    }
  },
  {
    "name": "MOLD AND PART SUPPLY",
    "details": {
      "availability": "Not specified",
      "service_name": "MOLD AND PART SUPPLY",
      "pricing_offers": "[\\n    \\"$.01 / PART DETAIL - $.01 per part pricing detail (low as possible)\\",\\n    \\"$.01 per part pricing detail (low as possible)\\"\\n]",
      "service_description": "Complete tooling solution that supplies cost-reduced production parts. The service builds the best tooling solution for customers while minimizing cycle time with consideration of performance and cosmetics. The company focuses on getting customers into low-cost production tools while optimizing part pricing. Services include mold design, production tooling, and high volume optimized part pricing. The team is very upfront with costs so customers can contribute to optimized design. They provide detailed pricing based on simple parameters and focus on itemizing and prioritizing cost structure related to manufactured parts."
    }
  },
  {
    "name": "PARTS DESIGN",
    "details": {
      "availability": "Not specified",
      "service_name": "PARTS DESIGN",
      "pricing_offers": "[\\n    \\"Not specified\\"\\n]",
      "service_description": "Comprehensive parts design services focused on injection molded components. The service includes intimate examination and development of components and assemblies for ergonomics, fit and function, tolerance stacking, and lifecycle performance. Design services encompass implementing changes for moldability, wall thickness modifications, gate sizing, vent sizing and location considerations. The team works on optimizing design features and part performance throughout the development process."
    }
  },
  {
    "name": "Emergency Lighting",
    "details": {
      "availability": "Week Days: 8:00 \\u2013 5:00, Saturday: 9:00 \\u2013 5:00, Sunday: 11:00 \\u2013 4:00",
      "service_name": "Emergency Lighting",
      "pricing_offers": "[\\n    \\"Not specified\\"\\n]",
      "service_description": "Emergency lighting services as listed in their other services portfolio. The service description indicates it involves work related to emergency lighting systems."
    }
  },
  {
    "name": "COMPLIANT MECHANISMS DESIGN",
    "details": {
      "availability": "Not specified",
      "service_name": "COMPLIANT MECHANISMS DESIGN",
      "pricing_offers": "[\\n    \\"Not specified\\"\\n]",
      "service_description": "Specialized design service in collaboration with Studio Weber and Associates focusing on Hinj compliant mechanisms. Hinj is organized around the idea of dematerialization and performance optimization through research and development of compliant mechanisms. A compliant mechanism is a mechanical structure or device that achieves motion or force transmission through the deformation of its flexible components, rather than traditional rigid joints and connections. Compliant mechanisms are designed to bend, twist, or flex to perform specific tasks or functions, without the need for traditional hinges, screws, or bearings."
    }
  },
  {
    "name": "APPLICATION TESTING",
    "details": {
      "availability": "Not specified",
      "service_name": "APPLICATION TESTING",
      "pricing_offers": "[\\n    \\"Not specified\\"\\n]",
      "service_description": "Application testing services to ensure parts meet performance requirements. Testing is conducted as part of their comprehensive qualification process to validate part functionality and performance in real-world applications."
    }
  },
  {
    "name": "MOLD DESIGN",
    "details": {
      "availability": "Not specified",
      "service_name": "MOLD DESIGN",
      "pricing_offers": "[\\n    \\"Not specified\\"\\n]",
      "service_description": "Mold design services as part of their injection molding solutions. Services include detailed mold design work, mold flow analysis, and optimization for production efficiency. The team handles all aspects of mold design including gate sizing, vent sizing and location, and modifications to minimize sink and flash. Mold design is integrated with their overall part development and manufacturing process."
    }
  },
  {
    "name": "Project Management",
    "details": {
      "availability": "Week Days: 8:00 \\u2013 5:00, Saturday: 9:00 \\u2013 5:00, Sunday: 11:00 \\u2013 4:00",
      "service_name": "Project Management",
      "pricing_offers": "[\\n    \\"Not specified\\"\\n]",
      "service_description": "Project management services for overseeing electrical and related projects. The service includes comprehensive project management for various electrical and installation projects."
    }
  }
]`,
  productInformationJson: `[]`,
  paaDataJson: `[
  "How big can injection molded parts be?",
  "How much does it cost to injection mold a part?"
]`,
};

const CLIENT_MOREX_RIBBON: ClientSample = {
  id: `b4c87be9-0ea3-4685-ace4-9cc7d1556db7`,
  slug: `morex-ribbon`,
  name: `Morex Ribbon`,
  url: `https://www.morexribbon.com/`,
  primaryLogoUrl: `https://file-host.link/website/morexribbon-3ae2rn/assets/logo/logo.webp`,
  sampleServiceTopic: ``,
  sampleCategoryTopic: `Lace Trims & Bindings`,
  sampleBlogTopic: `Top 10 Christmas Ribbon Manufacturers in the US`,
  designTokensJson: `{
  "fonts": {
    "body_font_url": "https://fonts.googleapis.com/css2?family=Inter:wght@300..700&display=swap",
    "heading_font_url": "https://fonts.googleapis.com/css2?family=Urbanist:wght@300..700&display=swap"
  },
  "css_variables": {
    "--color-brand-text": "#1A1A1C",
    "--font-family-body": "Inter, ui-sans-serif, system-ui, sans-serif",
    "--color-brand-primary": "#F2197D",
    "--font-family-heading": "Urbanist, ui-sans-serif, system-ui, sans-serif",
    "--color-brand-secondary": "#5F5F63",
    "--color-brand-text-muted": "#9A9A9E",
    "--color-brand-primary-dark": "#A80D56",
    "--color-brand-text-inverse": "#ffffff",
    "--color-brand-text-primary": "#1A1A1C",
    "--color-brand-primary-hover": "#D4106C",
    "--color-brand-primary-light": "rgba(242, 25, 125, 0.05)",
    "--color-brand-text-tertiary": "#5F5F63",
    "--color-brand-primary-medium": "rgba(242, 25, 125, 0.1)",
    "--color-brand-secondary-dark": "#38383B",
    "--color-brand-text-secondary": "#38383B",
    "--color-brand-secondary-hover": "#4A4A4E",
    "--color-brand-secondary-light": "rgba(95, 95, 99, 0.05)",
    "--color-brand-secondary-medium": "rgba(95, 95, 99, 0.1)",
    "--color-brand-primary-foreground": "#ffffff",
    "--color-brand-secondary-foreground": "#ffffff"
  }
}`,
  companyInfoJson: `{
  "name": {
    "dba_name": "Morex Ribbon",
    "legal_name": "Morex Corp",
    "company_name": "Morex Ribbon"
  },
  "founded": {
    "founded_date_year": null,
    "years_in_business": null
  },
  "locations": {
    "branch_locations": [],
    "headquarters_address": "York, PA"
  },
  "credentials": {
    "memberships": [],
    "accreditations": [],
    "certifications": [
      "Oeko-Tex Standard 100"
    ],
    "business_licenses": []
  },
  "company_size": {
    "employee_count": null,
    "annual_turnover": null
  },
  "service_team": {
    "team_members": [],
    "employee_count": null,
    "years_of_experience": null
  },
  "company_story": {
    "milestones": [],
    "founding_story": null,
    "company_history": null,
    "growth_narrative": null
  },
  "phone_numbers": [
    "+1 800-466-7393",
    "800-466-7393"
  ],
  "service_areas": [],
  "working_hours": {
    "Friday": [
      "8AM-4:30PM"
    ],
    "Monday": [
      "8AM-4:30PM"
    ],
    "Sunday": [
      "Closed"
    ],
    "Tuesday": [
      "8AM-4:30PM"
    ],
    "Saturday": [
      "Closed"
    ],
    "Thursday": [
      "8AM-4:30PM"
    ],
    "Wednesday": [
      "8AM-4:30PM"
    ]
  },
  "email_addresses": [
    "orders@morexribbon.com"
  ],
  "major_customers": [
    {
      "customer_name": "A.C. Moore",
      "customer_logo_url": null
    }
  ],
  "ratings_reviews": {
    "GBP": {
      "rating": 5,
      "review_count": 1
    }
  },
  "business_category": [
    "Manufacturer"
  ],
  "target_geographies": [
    "us"
  ],
  "value_propositions": {
    "key_benefits": [
      "Brilliant Colors",
      "Colorfast materials",
      "Machine washable and dry cleanable options",
      "Suitable for multiple applications: floral, crafts, packaging, hairbows, scrapbooking, bridal, baby, and party",
      "Consistent quality service",
      "Best Selling Holiday Color Mix",
      "Various widths and lengths to suit different project needs"
    ],
    "market_positioning": "Leading wholesale ribbon supplier offering the widest selection of premium quality ribbons for craft, floral, packaging, and specialty markets with exclusive imported collections and comprehensive merchandising solutions",
    "competitive_advantages": [
      "Extensive product catalog with over 500 ribbon styles",
      "Wide variety of ribbon types including grosgrain, satin, sheer, wired, glitter, and specialty ribbons",
      "Multiple packaging options including retail spools, bulk rolls, and value spools",
      "Seasonal and holiday-specific collections",
      "Point-of-Purchase Free Standing Displays available",
      "Easy to Merchandize display solutions",
      "Made in Switzerland quality for premium lines"
    ],
    "unique_selling_propositions": [
      "Morex Ribbon Exclusives Imported From Germany",
      "World Wide Highest Quality Standard and world's finest Materials used",
      "Swiss Satin - 100% Polyester, Colorfast, Machine washable up to 140°F/60°C",
      "All Colors tested according to Oeko-Tex Standard 100",
      "197 Glorious Colors available",
      "18 Widths available",
      "Garment Quality, Washable, Dry Cleanable, Tumble Or Drip Dry"
    ]
  },
  "awards_recognitions": [],
  "social_media_profiles": {
    "other": [
      "https://www.pinterest.com/morexribbon"
    ],
    "yelp_url": null,
    "twitter_url": null,
    "youtube_url": null,
    "facebook_url": "https://www.facebook.com/morexribbon/",
    "linkedin_url": null,
    "whatsapp_url": null,
    "instagram_url": "https://www.instagram.com/morexribbon/"
  },
  "target_customer_segments": [
    "Floral Industry",
    "Craft & Hobby Retailers",
    "Scrapbooking",
    "Fabric / Sewing",
    "Hairbow Makers",
    "Party Supply",
    "Bridal/Prom",
    "Baby Products",
    "Packaging Industry",
    "Medical Supplies",
    "Sports Teams"
  ],
  "mission_statement_company_values": {
    "vision": null,
    "taglines": [
      "The Pure Color of Ribbon - Premium Ribbon Solutions for Every Occasion"
    ],
    "core_values": [],
    "mission_statement": null
  }
}`,
  additionalInfoJson: `{
  "business_profile": {
    "inventory_nature": "100% Consumable Finished Goods - ribbon sold by the yard/spool in various widths, lengths, and materials; includes pre-made bows and curling ribbon accessories",
    "business_identity": "B2B wholesale distributor and manufacturer of decorative ribbon products, selling finished ribbon spools, bows, and curling ribbon by the yard for craft, floral, packaging, and seasonal decoration industries.",
    "primary_verticals": [
      "Ribbon by Style (Grosgrain, Satin, Sheer, Wired, Glitter, Velvet, Burlap)",
      "Ribbon by Season (Christmas, Halloween, Easter, Patriotic, Spring, Autumn, Valentines)",
      "Ribbon by Use Case (Floral, Bridal/Prom, Baby, Party, Scrapbooking, Hairbow, Fabric/Sewing)",
      "Ribbon by Pattern (Check/Plaid, Dots, Stripes, Animal Prints, Chevrons)",
      "Packaging Basics (Curling Ribbon, Bows, Cords)"
    ],
    "explicit_out_of_scope": [
      "Raw textile manufacturing equipment",
      "Ribbon printing/customization services",
      "Non-ribbon craft supplies (paper, adhesives, scissors, tools)",
      "Fabric by the bolt (non-ribbon textiles)",
      "Apparel or finished garments",
      "Home decor items beyond ribbon",
      "Rental services",
      "Installation or application services",
      "Used or refurbished products"
    ]
  }
}`,
  logoUrlsJson: `{
  "favicon": "https://file-host.link/website/morexribbon-3ae2rn/assets/logo/1773668152969880_7e4b21ebea7342dba7992f95c57b5ee2.png",
  "gbp_url": "https://file-host.link/website/morexribbon-3ae2rn/assets/logo/1773668034345727_446e673653ca47479b440b0e6f5f6152.webp",
  "primary_logo": "https://file-host.link/website/morexribbon-3ae2rn/assets/logo/logo.webp"
}`,
  serviceCatalogJson: `[
  {
    "name": "Trade Show Participation",
    "details": {
      "availability": "Not specified",
      "service_name": "Trade Show Participation",
      "pricing_offers": "[\\n    \\"Not specified\\"\\n]",
      "service_description": "Morex Ribbon participates in trade shows to showcase their ribbon products. The company provides trade show booth setup, attends various trade shows, and ensures area representation is available for trade shows in sales representative localities. Trade show information and schedules are available on their website."
    }
  },
  {
    "name": "Customer Service",
    "details": {
      "availability": "Not specified",
      "service_name": "Customer Service",
      "pricing_offers": "[\\n    \\"Not specified\\"\\n]",
      "service_description": "Customer service department provides service and support to customers, sales representatives, and sales team. Responsibilities include processing customer orders, handling EDI transfers, resolving customer problems and concerns in a courteous and professional manner, providing order confirmations, expediting orders with Production and Shipping, and preparation and mailing of sample cards, sample yardage, catalogs, and sales materials. The department can be contacted at 800-466-7393 or via email at orders@morexribbon.com."
    }
  },
  {
    "name": "Ribbon Product Sales",
    "details": {
      "availability": "Not specified",
      "service_name": "Ribbon Product Sales",
      "pricing_offers": "[\\n    \\"Wholesale pricing available - specific prices vary by product style, width, and yardage\\",\\n    \\"Bulk products available in various yardages (20 yards, 50 yards, 100 yards, etc.)\\",\\n    \\"Consumer-sized spools and variety trays available\\"\\n]",
      "service_description": "Morex Ribbon offers wholesale ribbon products across multiple categories including: All Styles, Bowdabra, Packaging Basics, New Items, Value Spools, Sports ribbons, and seasonal collections (Christmas, Easter, Halloween, Patriotic, Spring, Summer, Valentines, Autumn, St. Patrick's Day). Product styles include Animal Prints, Bow, Burlap Trend, Check/Plaid, Chevrons, Cord, Curling Ribbon, Dots, Double Ruffle, Embossed Poly, Glitter Ribbon, Grosgrain, Lace, Metallic, Picot, Printed Ribbon, Raffia, Satin, Script, Sheer, Stripe, Swiss Satin & Velvet, Taffeta, Tulle, Velvet, and Wired Ribbon. Products are available for various uses including Baby, Bridal/Prom, Fabric/Sewing, Floral, Hairbow Ribbon, Party Ribbon, and Scrapbooking. The company offers 197 glorious colors in their Satin line with 19 different widths."
    }
  }
]`,
  productInformationJson: `[
  {
    "name": "Wired Ribbon",
    "details": {
      "product_key": "Wired Ribbon",
      "manufacturer": "Morex Ribbon",
      "product_name": "Wired Ribbon",
      "support_service": [
        "Customer service available at 800-466-7393",
        "Email support at orders@morexribbon.com",
        "Online catalog and product resources available",
        "Trade show presence for product demonstrations"
      ],
      "served_locations": [
        "USA"
      ],
      "shipping_returns": "Shipping and return information available through customer service at 800-466-7393 or orders@morexribbon.com. Standard wholesale ordering available through authorized retailers and distributors.",
      "key_features_usps": [
        "Wired edges allow for easy shaping and creating professional bows that hold their form",
        "Extensive variety of styles including Lyon French Wired Taffeta, Dream Wired Satin, Polka Dots, and seasonal designs",
        "Available in multiple widths from 3/8\\" to 6\\" and lengths from 10 to 100 yards to suit various project needs",
        "High-quality materials including 100% polyester options that are colorfast, washable, and dry cleanable",
        "Wide color selection with 34+ colors available across different styles for creative flexibility"
      ],
      "ownership_options": [
        "Purchase"
      ],
      "product_identifier": "Multiple styles including #96, #464, #301, #303, #916, #340, #986, #7390-7421",
      "pricing_information": "Wholesale list prices vary by style and width. Examples: #301 Mini Stars 1\\" x 22 yards $14.90, 1.5\\" x 22 yards $20.90. #303 Liberty 1.5\\" x 22 yards $14.90. #96 Dream available in multiple widths from 5/8\\" to 2.25\\" in 10, 15, 50, and 100 yard spools. Volume pricing available for 50 and 100 yard spools. Contact for exact pricing.",
      "applications_use_cases": [
        "Floral arrangements and bouquet decoration",
        "Gift wrapping and package decoration",
        "Bow making for crafts and decorative purposes",
        "Seasonal and holiday decorations including Christmas, Patriotic, Halloween, Easter, and Autumn themes",
        "Wedding and bridal decorations",
        "Party and event decoration",
        "Scrapbbooking and paper crafts",
        "Hair bow creation",
        "Fabric and sewing projects"
      ],
      "regulatory_information": [
        "Oeko-Tex Standard 100 certified for highest quality and safety standards",
        "Made in Switzerland for Swiss Satin styles with worldwide highest quality materials"
      ],
      "associate_certifications": [
        "Oeko-Tex Standard 100"
      ],
      "technical_specifications": {
        "Material": "Various including Taffeta, Satin, Chiffon, Sheer, Burlap, Metallic",
        "Color Range": "Available in 34+ colors depending on style",
        "Construction": "Wired edges for shaping and bow-making",
        "Width Options": "Multiple widths from 3/8\\" to 6\\" depending on style",
        "Length Options": "10 yards, 20 yards, 22 yards, 25 yards, 50 yards, 100 yards depending on style",
        "Special Features": "Some styles include glitter, dots, stripes, plaids, animal prints, and seasonal designs",
        "Care Instructions": "100% Polyester styles are colorfast, machine washable up to 140\\u00b0F/60\\u00b0C, no chlorine treatment, iron up to 230\\u00b0F/110\\u00b0C, dry cleanable"
      }
    }
  },
  {
    "name": "McPack ribbon shredder",
    "details": {
      "product_key": "McPack ribbon shredder",
      "manufacturer": null,
      "product_name": "McPack ribbon shredder",
      "support_service": [],
      "served_locations": [],
      "shipping_returns": null,
      "key_features_usps": [],
      "ownership_options": [
        "Purchase"
      ],
      "product_identifier": null,
      "pricing_information": "Pricing Available on Request",
      "applications_use_cases": [],
      "regulatory_information": [],
      "associate_certifications": [],
      "technical_specifications": {}
    }
  },
  {
    "name": "Glitter Ribbon",
    "details": {
      "image_id": "refined-images/1773670037460223_5115494b29f647f89a4911b7f119685a",
      "filter_data": {
        "Ribbon Style": [
          "Glitter",
          "Grosgrain"
        ],
        "Spool Length": [
          "Standard (20\\u201350 yards)",
          "Bulk (100 yards)"
        ],
        "Maximum Width": [
          "Narrow (up to 1.5 inch)"
        ],
        "Primary Use Case": [
          "Seasonal & Holiday",
          "Hairbow & Crafts",
          "Gift Wrapping & Packaging",
          "Floral & Bridal"
        ]
      },
      "product_key": "Glitter Ribbon",
      "manufacturer": "Morex Ribbon",
      "product_name": "Glitter Ribbon",
      "product_media": [
        {
          "url": "https://file-host.link/website/morexribbon-3ae2rn/assets/refined-images/1773670037460223_5115494b29f647f89a4911b7f119685a/1080.webp"
        }
      ],
      "support_service": [
        "Customer service available at 800-466-7393",
        "Email support at orders@morexribbon.com",
        "Online catalog and product resources available",
        "Trade show presence for product demonstrations"
      ],
      "served_locations": [
        "USA"
      ],
      "shipping_returns": "Shipping and return information available upon request. Contact customer service at 800-466-7393 or orders@morexribbon.com",
      "key_features_usps": [
        "Multiple glitter ribbon styles including Dazzle solid glitter grosgrain, Dazzle Dots, and Sugar Dots patterns",
        "Available in various widths from 3/8 inch to 1.5 inches and lengths from 20 to 100 yards",
        "Coordinating solid and dotted patterns available for creative matching",
        "Suitable for gift wrapping, crafts, hairbows, scrapbooking, and party decorations",
        "High-quality polyester construction with colorfast properties"
      ],
      "ownership_options": [
        "Purchase"
      ],
      "product_identifier": "990",
      "pricing_information": "Wholesale pricing available. Individual spool pricing ranges from $0.49 to $1.99 per piece depending on style and size. Volume pricing available for 100-yard spools and bulk orders",
      "applications_use_cases": [
        "Gift wrapping and packaging",
        "Hairbow creation",
        "Scrapbooking and paper crafts",
        "Party decorations and event styling",
        "Floral arrangements",
        "Bridal and prom accessories",
        "Fabric and sewing projects",
        "Holiday and seasonal decorations including Christmas"
      ],
      "regulatory_information": [
        "Colors tested according to Oeko-Tex Standard 100 for Swiss Satin products",
        "Machine washable up to 140\\u00b0F/60\\u00b0C for select products",
        "Dry cleanable with reduced heat treatment in tumble-dryer"
      ],
      "associate_certifications": [
        "Oeko-Tex Standard 100"
      ],
      "technical_specifications": {
        "Material": "Glittered Grosgrain, Glittered Polyester",
        "Available_Colors": "34 colors for Pattern 990, 9 colors for Pattern 989, multiple colors for Pattern 988",
        "Pattern_990_Dazzle": "3/8 inch x 20 yards, 3/8 inch x 100 yards, 5/8 inch x 20 yards, 5/8 inch x 100 yards, 7/8 inch x 20 yards, 7/8 inch x 100 yards, 1.5 inch x 20 yards, 1.5 inch x 100 yards",
        "Pattern_988_Sugar_Dots": "7/8 inch x 20 yards, 7/8 inch x 100 yards, 1.5 inch x 20 yards, 1.5 inch x 100 yards",
        "Pattern_989_Dazzle_Dots": "3/8 inch x 20 yards, 7/8 inch x 20 yards, 7/8 inch x 100 yards",
        "Pattern_185_Glitter_Poly": "Glittered curling ribbon, 10mm x 100m (3/8 inch x 109 yards), 90mm x 20m (3.5 inch x 22 yards)",
        "Pattern_986_Vienna_Glitter": "Wired glitter ribbon",
        "Pattern_987_Velvet_Glitter": "Velvet with glitter finish",
        "Pattern_985_Princess_Glitter": "Available in multiple widths"
      }
    }
  },
  {
    "name": "Patriotic Ribbon",
    "details": {
      "product_key": "Patriotic Ribbon",
      "manufacturer": "Morex Ribbon",
      "product_name": "Patriotic Ribbon",
      "support_service": [
        "Customer service available at 800-466-7393",
        "Email support at orders@morexribbon.com",
        "Online catalog access for product browsing",
        "Resources section available on website"
      ],
      "served_locations": [
        "USA"
      ],
      "shipping_returns": "Shipping and return information available upon request. For more information call customer service department at 800-466-7393 or via email orders@morexribbon.com.",
      "key_features_usps": [
        "Comprehensive patriotic ribbon collection featuring red, white, and blue color schemes in multiple styles including wired, grosgrain, burlap, and printed designs",
        "Value-priced variety trays available with special tray pricing, offering per spool costs as low as $1.96 with MSRP up to $4.99",
        "Wide range of widths from 3/16 inch to 4 inches and lengths from 3 yards to 100 yards to suit various crafting and decorating needs",
        "Multiple pattern options including stars, stripes, dots, vintage flag designs, and natural burlap accents for diverse patriotic applications",
        "Easy Bow collections and 3-pack consumer-sized spools available for convenient purchasing and gift-giving"
      ],
      "ownership_options": [
        "Purchase"
      ],
      "product_identifier": null,
      "pricing_information": "Special tray pricing available. Patriotic Vintage Tray: Special Tray Price $41.16, Special per spool cost $1.96, MSRP per spool $4.99. Patriotic Tray: Special Tray Price $41.16, Special per spool cost $1.96, MSRP per spool $4.99. Patriotic Spirit Tray: Special Tray Price $47.04, Special per spool cost $1.96, MSRP per spool $4.99. American Spirit Tray: Special Tray Price $52.50, Special average per cost $5.25, MSRP per spool $9.99. Country Burlap Tray: Special Tray Price $59.70, Special per spool cost $5.97, MSRP per spool $9.99. Patriotic Burlap Tray: Special Tray Price $72.00, Special per spool cost $4.50, MSRP per spool $9.99. Easy Bow Patriotic Assortment-12pk: Special price $9.00, MSRP $19.99. Individual ribbon spools available at wholesale list prices ranging from $4.95 to $49.90 depending on width and yardage.",
      "applications_use_cases": [
        "Patriotic holiday decorations for Independence Day, Memorial Day, and Veterans Day celebrations",
        "Floral arrangements and wreaths with patriotic themes",
        "Gift wrapping and packaging for patriotic occasions",
        "Craft projects including bows, banners, and decorative accents",
        "Party decorations and event styling for patriotic gatherings",
        "Scrapbooking and memory preservation projects",
        "Hair bow creation and fashion accessories"
      ],
      "regulatory_information": [],
      "associate_certifications": [],
      "technical_specifications": {
        "Wire_Type": "Wired and non-wired options available",
        "Color_Schemes": "Red, White, Blue combinations",
        "Width_Options": "3/16 inch to 4 inch",
        "Length_Options": "3 yards to 100 yards per spool",
        "Material_Types": "Wired ribbon, grosgrain, burlap, satin, sheer, curling ribbon, natural burlap accents",
        "Pattern_Styles": "Stars, stripes, dots, vintage flag, plaid, printed designs"
      }
    }
  },
  {
    "name": "Tulle Ribbon",
    "details": {
      "image_id": "refined-images/1773670011111938_33f92454c8244ce29e7ce871c12ec0f3",
      "filter_data": {
        "Application": [
          "Bridal & Prom",
          "Hairbow & Crafts",
          "Gift Wrapping & Packaging",
          "Seasonal & Holiday"
        ],
        "Ribbon Type": [
          "Tulle"
        ],
        "Material Base": [
          "Polyester"
        ],
        "Special Features": []
      },
      "product_key": "Tulle Ribbon",
      "manufacturer": "Morex Ribbon",
      "product_name": "Tulle Ribbon",
      "product_media": [
        {
          "url": "https://file-host.link/website/morexribbon-3ae2rn/assets/refined-images/1773670011111938_33f92454c8244ce29e7ce871c12ec0f3/1080.webp"
        }
      ],
      "support_service": [
        "Customer service available at 800-466-7393",
        "Email support at orders@morexribbon.com"
      ],
      "served_locations": [
        "USA"
      ],
      "shipping_returns": "For more information call customer service at 800-466-7393 or via email orders@morexribbon.com",
      "key_features_usps": [
        "100% polyester construction",
        "Colorfast and garment quality",
        "Washable, dry cleanable, tumble or drip dry",
        "Available in multiple widths and colors"
      ],
      "ownership_options": [
        "Purchase"
      ],
      "product_identifier": "13",
      "pricing_information": "Pricing Available on Request",
      "applications_use_cases": [
        "Bridal and Prom applications",
        "Party decorations",
        "Scrapbooking projects",
        "Floral arrangements",
        "Baby shower decorations",
        "Hairbow making",
        "Fabric and sewing projects"
      ],
      "regulatory_information": [],
      "associate_certifications": [],
      "technical_specifications": {
        "Category": "Ribbon",
        "Material": "100% polyester",
        "Product_Type": "Tulle Ribbon",
        "Style_Number": "13"
      }
    }
  },
  {
    "name": "Custom Printed Ribbon",
    "details": {
      "image_id": "refined-images/1773669967167854_31d9003061484105b12e01ee2a8ae10c",
      "filter_data": {
        "Ribbon Style": [
          "Grosgrain",
          "Satin",
          "Glitter",
          "Wired",
          "Printed"
        ],
        "Spool Length": [
          "Short (3\\u201325 yards)",
          "Standard (20\\u201350 yards)",
          "Bulk (100 yards)"
        ],
        "Maximum Width": [
          "Narrow (up to 1.5 inch)",
          "Wide (up to 4 inch)"
        ],
        "Primary Use Case": [
          "Seasonal & Holiday",
          "Hairbow & Crafts",
          "Gift Wrapping & Packaging",
          "Floral & Bridal"
        ]
      },
      "product_key": "Custom Printed Ribbon",
      "manufacturer": "Morex Ribbon",
      "product_name": "Custom Printed Ribbon",
      "product_media": [
        {
          "url": "https://file-host.link/website/morexribbon-3ae2rn/assets/refined-images/1773669967167854_31d9003061484105b12e01ee2a8ae10c/1080.webp"
        }
      ],
      "support_service": [
        "Customer service available at 800-466-7393",
        "Email support at orders@morexribbon.com",
        "Catalogs available for product reference",
        "Where to buy information provided on website",
        "Resources and trade show information available"
      ],
      "served_locations": [
        "USA"
      ],
      "shipping_returns": "Contact customer service at 800-466-7393 or via email orders@morexribbon.com for shipping and return information.",
      "key_features_usps": [
        "197 glorious colors available in multiple ribbon styles and widths",
        "100% Polyester, colorfast, garment quality, washable and dry cleanable",
        "Wide variety of styles including grosgrain, satin, wired, sheer, metallic, glitter, and printed ribbons",
        "Available in consumer-sized spools and bulk products for various applications",
        "Tested according to Oeko-Tex Standard 100 for highest quality standards"
      ],
      "ownership_options": [
        "Purchase"
      ],
      "product_identifier": null,
      "pricing_information": "Pricing Available on Request",
      "applications_use_cases": [
        "Gift wrapping and packaging",
        "Floral arrangements and decorations",
        "Scrapbooking and crafts",
        "Hair bows and fashion accessories",
        "Bridal and prom decorations",
        "Party decorations and event styling",
        "Seasonal and holiday decorations including Christmas, Halloween, Easter, Patriotic, Valentine's Day",
        "Baby shower and nursery decorations",
        "Fabric and sewing projects"
      ],
      "regulatory_information": [
        "All colors tested according to Oeko-Tex Standard 100"
      ],
      "associate_certifications": [
        "Oeko-Tex Standard 100"
      ],
      "technical_specifications": {
        "Material": "100% Polyester",
        "Ribbon Types": "Grosgrain, Satin (Double Face), Wired Ribbon, Sheer, Metallic, Glitter, Printed, Dots, Stripes, Plaid",
        "Color Options": "197 glorious colors available",
        "Available Widths": "Multiple widths available including 3/8 inch, 5/8 inch, 7/8 inch, 1 inch, 1.5 inch, 2.5 inch",
        "Available Lengths": "Various lengths including 20 yards, 22 yards, 25 yards, 50 yards, 100 yards",
        "Care Instructions": "Colorfast, Machine wash up to 140\\u00b0F/60\\u00b0C, No chlorine treatment, Iron up to 230\\u00b0F/110\\u00b0C, Dry Cleanable, Tumble-Dryer with reduced heat"
      }
    }
  },
  {
    "name": "Swiss Satin Ribbon",
    "details": {
      "product_key": "Swiss Satin Ribbon",
      "manufacturer": "Morex Ribbon",
      "product_name": "Swiss Satin Ribbon",
      "support_service": [
        "Customer service available at 800-466-7393",
        "Email support at orders@morexribbon.com"
      ],
      "served_locations": [
        "USA"
      ],
      "shipping_returns": "Shipping and return information available through customer service at 800-466-7393 or orders@morexribbon.com",
      "key_features_usps": [
        "100% Polyester double face satin ribbon with world's highest quality standard",
        "Colorfast and machine washable up to 140\\u00b0F/60\\u00b0C",
        "All colors tested according to Oeko-Tex Standard 100",
        "Made in Switzerland using world's finest materials",
        "Available in 18 widths ranging from 3mm to 100mm"
      ],
      "ownership_options": [
        "Purchase"
      ],
      "product_identifier": "035",
      "pricing_information": "Pricing Available on Request",
      "applications_use_cases": [
        "Fabric and Sewing projects",
        "Bridal and Prom applications",
        "Scrapbooking",
        "Floral arrangements",
        "Gift wrapping and packaging",
        "Hairbow creation"
      ],
      "regulatory_information": [
        "All colors tested according to Oeko-Tex Standard 100"
      ],
      "associate_certifications": [
        "Oeko-Tex Standard 100"
      ],
      "technical_specifications": {
        "Type": "Double Face Satin",
        "Material": "100% Polyester",
        "Colorfast": "Yes",
        "Spool Lengths": "3mm: 54.7 yards, 6mm-100mm: 27.3 yards",
        "Available Widths": "3mm (1/8\\"), 6mm (1/4\\"), 10mm (3/8\\"), 16mm (5/8\\"), 25mm (1\\"), 40mm (1\\u00bd\\"), 50mm (2\\"), 70mm (2\\u00be\\"), 100mm (4\\")",
        "Care Instructions": "Machine wash up to 140\\u00b0F/60\\u00b0C, No chlorine treatment, Iron up to 230\\u00b0F/110\\u00b0C, Dry Cleanable, Reduced Heat Treatment in Tumble-Dryer",
        "Country of Origin": "Made in Switzerland"
      }
    }
  },
  {
    "name": "Bowdabra Bow Maker",
    "details": {
      "product_key": "Bowdabra Bow Maker",
      "manufacturer": "Bowdabra",
      "product_name": "Bowdabra Bow Maker",
      "support_service": [
        "Customer service available at 800-466-7393",
        "Email support at orders@morexribbon.com"
      ],
      "served_locations": [
        "USA"
      ],
      "shipping_returns": "Shipping and return information available upon request. Contact customer service at 800-466-7393 or orders@morexribbon.com for details.",
      "key_features_usps": [
        "Easy bow-making tool for creating professional-looking bows",
        "Compatible with various ribbon types and widths",
        "Simplifies bow creation for crafting and gift wrapping",
        "Available through Morex Ribbon distribution channels"
      ],
      "ownership_options": [
        "Purchase"
      ],
      "product_identifier": null,
      "pricing_information": "Pricing Available on Request",
      "applications_use_cases": [
        "Gift wrapping and packaging",
        "Floral arrangements and decorations",
        "Craft projects and DIY decorations",
        "Holiday and seasonal decorating",
        "Party and event decoration"
      ],
      "regulatory_information": [],
      "associate_certifications": [],
      "technical_specifications": {}
    }
  },
  {
    "name": "School or Sports Ribbon",
    "details": {
      "image_id": "refined-images/1773669978218203_d89746ec2a6c49cca30b510e6bcf59f9",
      "filter_data": {
        "Ribbon Style": [
          "Grosgrain",
          "Satin",
          "Glitter",
          "Wired",
          "Printed"
        ],
        "Spool Length": [
          "Short (3\\u201325 yards)",
          "Standard (20\\u201350 yards)",
          "Bulk (100 yards)"
        ],
        "Maximum Width": [
          "Narrow (up to 1.5 inch)",
          "Wide (up to 4 inch)"
        ],
        "Primary Use Case": [
          "School & Sports",
          "Seasonal & Holiday",
          "Hairbow & Crafts",
          "Gift Wrapping & Packaging"
        ]
      },
      "product_key": "School or Sports Ribbon",
      "manufacturer": "Morex Ribbon",
      "product_name": "School or Sports Ribbon",
      "product_media": [
        {
          "url": "https://file-host.link/website/morexribbon-3ae2rn/assets/refined-images/1773669978218203_d89746ec2a6c49cca30b510e6bcf59f9/1080.webp"
        }
      ],
      "support_service": [
        "Customer service available at 800-466-7393",
        "Email support at orders@morexribbon.com",
        "Online catalog and product browsing"
      ],
      "served_locations": [
        "USA"
      ],
      "shipping_returns": "For more information call customer service at 800-466-7393 or via email orders@morexribbon.com",
      "key_features_usps": [
        "Wide variety of ribbon styles and colors for school and sports applications",
        "Multiple width and length options available across different ribbon types",
        "Includes specialty ribbons such as grosgrain, satin, wired, and printed options",
        "Suitable for various crafting, decorating, and award applications",
        "Available in bulk spools and consumer-sized packages"
      ],
      "ownership_options": [
        "Purchase"
      ],
      "product_identifier": null,
      "pricing_information": "Pricing Available on Request",
      "applications_use_cases": [
        "School spirit and team decoration",
        "Sports awards and recognition ribbons",
        "Hairbow creation for cheerleading and dance teams",
        "Party and event decoration",
        "Scrapbooking and craft projects",
        "Gift wrapping and packaging"
      ],
      "regulatory_information": [],
      "associate_certifications": [],
      "technical_specifications": {
        "Use_Categories": "Baby, Bridal/Prom, Fabric/Sewing, Floral, Hairbow Ribbon, Party Ribbon, Scrapbooking",
        "Available_Styles": "Multiple styles including Animal Prints, Bow, Burlap Trend, Check/Plaid, Chevrons, Cord, Curling Ribbon, Dots, Double Ruffle, Embossed Poly, Glitter Ribbon, Grosgrain, Lace, Metallic, Picot, Printed Ribbon, Raffia, Satin, Script, Sheer, Stripe, Swiss Satin & Velvet, Taffeta, Tulle, Velvet, Wired Ribbon",
        "Product_Category": "Sports Ribbon",
        "Seasonal_Options": "Autumn, Christmas, Easter, Halloween, Patriotic, Spring, St. Patrick's Day, Summer, Valentines"
      }
    }
  },
  {
    "name": "Check or Plaid Ribbon",
    "details": {
      "product_key": "Check or Plaid Ribbon",
      "manufacturer": "Morex Ribbon",
      "product_name": "Check or Plaid Ribbon",
      "support_service": [
        "Customer service available at 800-466-7393",
        "Email support at orders@morexribbon.com",
        "Online catalog and resources available"
      ],
      "served_locations": [
        "USA"
      ],
      "shipping_returns": "Shipping and return information available upon request. Contact customer service at 800-466-7393 or orders@morexribbon.com",
      "key_features_usps": [
        "100% Polyester construction for durability and colorfastness",
        "Available in multiple widths from 3/16 inch to 1.5 inches",
        "Offered in both 22-yard and 110-yard lengths for various project needs",
        "Machine washable and dry cleanable for easy care",
        "Classic country check pattern suitable for multiple applications"
      ],
      "ownership_options": [
        "Purchase"
      ],
      "product_identifier": "957",
      "pricing_information": "Pricing Available on Request",
      "applications_use_cases": [
        "Scrapbooking and craft projects",
        "Gift wrapping and packaging",
        "Floral arrangements and decorations",
        "Fabric and sewing applications",
        "Party decorations and event styling",
        "Hairbow creation",
        "Bridal and wedding decorations"
      ],
      "regulatory_information": [
        "Tested according to Oeko-Tex Standard 100"
      ],
      "associate_certifications": [
        "Oeko-Tex Standard 100"
      ],
      "technical_specifications": {
        "Pattern": "957 Country Check",
        "Material": "100% Polyester",
        "Part Numbers": "95705/20 (3/16 inch x 22 yards), 95710/20 (3/8 inch x 22 yards), 95715/20 (5/8 inch x 22 yards), 95725/20 (1 inch x 22 yards), 95740/20 (1.5 inch x 22 yards), 95705/00 (3/16 inch x 110 yards), 95710/00 (3/8 inch x 110 yards), 95715/00 (5/8 inch x 110 yards), 95725/00 (1 inch x 110 yards), 95740/00 (1.5 inch x 110 yards)",
        "Style Category": "Check/Plaid",
        "Available Widths": "3/16 inch, 3/8 inch, 5/8 inch, 1 inch, 1.5 inch",
        "Available Lengths": "22 yards, 110 yards",
        "Care Instructions": "Colorfast, Machine wash up to 140\\u00b0F/60\\u00b0C, No chlorine treatment, Iron up to 230\\u00b0F/110\\u00b0C, Dry Cleanable, Reduced Heat Treatment in Tumble-Dryer"
      }
    }
  },
  {
    "name": "Easter or Everyday Spring Ribbon",
    "details": {
      "image_id": "refined-images/1773669981446278_77d1c9b9297448339abe9823617652aa",
      "filter_data": {
        "Ribbon Style": [
          "Grosgrain",
          "Satin",
          "Wired",
          "Printed"
        ],
        "Spool Length": [
          "Short (3\\u201325 yards)",
          "Standard (20\\u201350 yards)",
          "Bulk (100 yards)"
        ],
        "Maximum Width": [
          "Wide (up to 4 inch)"
        ],
        "Primary Use Case": [
          "Seasonal & Holiday",
          "Hairbow & Crafts",
          "Gift Wrapping & Packaging",
          "Floral & Bridal"
        ]
      },
      "product_key": "Easter or Everyday Spring Ribbon",
      "manufacturer": "Morex Ribbon",
      "product_name": "Easter or Everyday Spring Ribbon",
      "product_media": [
        {
          "url": "https://file-host.link/website/morexribbon-3ae2rn/assets/refined-images/1773669981446278_77d1c9b9297448339abe9823617652aa/1080.webp"
        }
      ],
      "support_service": [
        "Customer service available at 800-466-7393",
        "Email support at orders@morexribbon.com",
        "Online catalog and resources available at morexribbon.com"
      ],
      "served_locations": [
        "USA"
      ],
      "shipping_returns": "For more information call customer service department at 800-466-7393 or via email orders@morexribbon.com",
      "key_features_usps": [
        "Wide variety of ribbon styles including satin, grosgrain, sheer, wired, and specialty ribbons for spring and Easter themes",
        "Available in multiple widths from 3/16 inch to 4 inches and lengths from 3 yards to 100 yards",
        "Colorfast and machine washable materials tested to Oeko-Tex Standard 100",
        "Extensive color selection including spring pastels, bright colors, and seasonal patterns",
        "Suitable for multiple applications including floral arrangements, gift wrapping, crafts, and decorative purposes"
      ],
      "ownership_options": [
        "Purchase"
      ],
      "product_identifier": null,
      "pricing_information": "Pricing Available on Request",
      "applications_use_cases": [
        "Easter decorations and gift wrapping",
        "Spring floral arrangements and bouquets",
        "Baby shower and bridal decorations",
        "Scrapbooking and craft projects",
        "Party ribbon and event decorations",
        "Hairbow making and fabric sewing",
        "Packaging and retail display"
      ],
      "regulatory_information": [
        "All colors tested according to Oeko-Tex Standard 100"
      ],
      "associate_certifications": [
        "Oeko-Tex Standard 100"
      ],
      "technical_specifications": {
        "Material": "Polyester, Satin, Grosgrain, Sheer, Wired, Burlap, Metallic, Glitter, Velvet, Taffeta, Organdy",
        "Product Types": "Double Face Satin, Grosgrain, Sheer Organdy, Wired Ribbon, Printed Ribbon, Glitter Ribbon, Polka Dots, Stripes, Plaid",
        "Width Options": "3/16 inch to 4 inches",
        "Length Options": "3 yards to 100 yards",
        "Care Instructions": "Machine wash up to 140\\u00b0F/60\\u00b0C, No chlorine treatment, Iron up to 230\\u00b0F/110\\u00b0C, Dry Cleanable"
      }
    }
  },
  {
    "name": "Lace Ribbon",
    "details": {
      "image_id": "refined-images/1773669985135424_cb56e1123c004297b01a175584364f32",
      "filter_data": {
        "Application": [
          "Bridal & Prom",
          "Hairbow & Crafts",
          "Gift Wrapping & Packaging",
          "Seasonal & Holiday"
        ],
        "Ribbon Type": [
          "Lace"
        ],
        "Material Base": [
          "Polyester"
        ],
        "Special Features": [
          "Lace/Textured Detail"
        ]
      },
      "product_key": "Lace Ribbon",
      "manufacturer": "Morex Ribbon",
      "product_name": "Lace Ribbon",
      "product_media": [
        {
          "url": "https://file-host.link/website/morexribbon-3ae2rn/assets/refined-images/1773669985135424_cb56e1123c004297b01a175584364f32/1080.webp"
        }
      ],
      "support_service": [
        "Customer service available at 800-466-7393",
        "Email support at orders@morexribbon.com"
      ],
      "served_locations": [
        "USA"
      ],
      "shipping_returns": "For more information call customer service department at 800-466-7393 or via email orders@morexribbon.com",
      "key_features_usps": [
        "Available in multiple widths and lengths for various applications",
        "100% Polyester construction ensures durability and colorfastness",
        "Tested according to Oeko-Tex Standard 100 for safety and quality",
        "Suitable for bridal, prom, floral, scrapbooking, and fabric/sewing applications"
      ],
      "ownership_options": [
        "Purchase"
      ],
      "product_identifier": "37",
      "pricing_information": "Pricing Available on Request",
      "applications_use_cases": [
        "Bridal/Prom decorations and accessories",
        "Floral arrangements and gift wrapping",
        "Scrapbooking and craft projects",
        "Fabric and sewing applications",
        "Baby shower and party decorations"
      ],
      "regulatory_information": [
        "Tested according to Oeko-Tex Standard 100"
      ],
      "associate_certifications": [],
      "technical_specifications": {
        "Style": "Lace",
        "Material": "100% Polyester",
        "Care Instructions": "Colorfast. Machine wash up to 140\\u00b0F/60\\u00b0C. No chlorine treatment. No hot iron, only up to 230\\u00b0F/110\\u00b0C. Dry Cleanable. Reduced Heat Treatment in Tumble-Dryer",
        "Quality Standards": "All Colors tested according to Oeko-Tex Standard 100"
      }
    }
  },
  {
    "name": "Flora Satin",
    "details": {
      "product_key": "Flora Satin",
      "manufacturer": "Morex Ribbon",
      "product_name": "Flora Satin",
      "support_service": [
        "Customer service available at 800-466-7393",
        "Email support at orders@morexribbon.com",
        "Online catalog and product resources available"
      ],
      "served_locations": [
        "USA"
      ],
      "shipping_returns": "Shipping and return information available upon request from Morex Ribbon customer service at 800-466-7393 or orders@morexribbon.com",
      "key_features_usps": [
        "Double face satin construction with brilliant colors",
        "100% Polyester material that is colorfast and garment quality",
        "Washable and dry cleanable with tumble or drip dry options",
        "Available in multiple widths and yardages for various applications",
        "Part of Morex Ribbon's extensive satin ribbon collection"
      ],
      "ownership_options": [
        "Purchase"
      ],
      "product_identifier": null,
      "pricing_information": "Pricing Available on Request",
      "applications_use_cases": [
        "Gift wrapping and packaging",
        "Floral arrangements and decorations",
        "Bridal and wedding applications",
        "Scrapbooking and crafts",
        "Hairbow creation",
        "Party decorations and special occasions"
      ],
      "regulatory_information": [],
      "associate_certifications": [],
      "technical_specifications": {
        "Material": "100% Polyester",
        "Product_Type": "Double Face Satin Ribbon",
        "Care_Instructions": "Colorfast, Garment Quality, Washable, Dry Cleanable, Tumble Or Drip Dry"
      }
    }
  },
  {
    "name": "Raffia Ribbon",
    "details": {
      "product_key": "Raffia Ribbon",
      "manufacturer": "Morex Ribbon",
      "product_name": "Raffia Ribbon",
      "support_service": [
        "Customer service available at 800-466-7393",
        "Email support at orders@morexribbon.com",
        "Online catalog and product resources available"
      ],
      "served_locations": [
        "USA"
      ],
      "shipping_returns": "Shipping and return information available upon request. Contact customer service at 800-466-7393 or via email orders@morexribbon.com.",
      "key_features_usps": [
        "Natural raffia material for authentic rustic appearance",
        "Available in multiple color options for versatile crafting",
        "Convenient 10 meter spools for easy handling and storage",
        "Wholesale pricing available for bulk orders at $1.99 per spool"
      ],
      "ownership_options": [
        "Purchase"
      ],
      "product_identifier": "1256",
      "pricing_information": "Wholesale price: $83.58 for 42 total spools at $1.99 per piece. Exact wholesale pricing shown for bulk orders.",
      "applications_use_cases": [
        "Floral arrangements and decorative wrapping",
        "Scrapbooking and craft projects",
        "Party decorations and gift packaging",
        "Seasonal and holiday crafting applications"
      ],
      "regulatory_information": [],
      "associate_certifications": [],
      "technical_specifications": {
        "Material": "Raffia",
        "Product Type": "Multi Raffia",
        "Style Number": "1256",
        "Total Spools": "42",
        "Length per Spool": "10 m (11 yards)"
      }
    }
  },
  {
    "name": "Christmas Ribbon",
    "details": {
      "product_key": "Christmas Ribbon or Poinsettia Ribbon",
      "manufacturer": "Morex Ribbon",
      "product_name": "Christmas Ribbon",
      "support_service": [
        "Customer service available at 800-466-7393",
        "Email support at orders@morexribbon.com",
        "Online catalog and resources available"
      ],
      "served_locations": [
        "USA"
      ],
      "shipping_returns": "Shipping and return information available upon request. For more information contact customer service at 800-466-7393 or via email orders@morexribbon.com",
      "key_features_usps": [
        "Best selling holiday color mix with easy to merchandise point-of-purchase free standing displays",
        "Wide variety of styles including woven, wired, metallic, curling ribbon, and printed designs",
        "Multiple width and length options ranging from 3/16 inch to 2.5 inches",
        "Available in coordinated collections and display trays for retail merchandising",
        "Imported from Germany with high quality materials"
      ],
      "ownership_options": [
        "Purchase"
      ],
      "product_identifier": null,
      "pricing_information": "Wholesale pricing available. Individual spools priced at $1.49 to $1.99 per piece. Display trays range from $41.79 to $232.44. Volume pricing available for bulk orders.",
      "applications_use_cases": [
        "Christmas gift wrapping and package decoration",
        "Holiday craft projects and DIY decorations",
        "Retail display and merchandising for seasonal products",
        "Floral arrangements and wreath making",
        "Party decoration and event styling",
        "Scrapbooking and paper crafts"
      ],
      "regulatory_information": [],
      "associate_certifications": [],
      "technical_specifications": {
        "Material": "Woven ribbon, some wired, metallic poly curling ribbon, organdy",
        "Packaging": "Individual spools, multi-spool trays, standing displays",
        "Width Options": "5mm (3/16\\"), 15mm (5/8\\"), 25mm (1\\"), 40mm (1.5\\"), and various other widths",
        "Length Options": "2m to 5m per spool (2.2 to 5.5 yards)",
        "Display Dimensions": "Width 50cm (19.75\\"), Depth 31cm (12.25\\"), Height 135cm (53.20\\")"
      }
    }
  },
  {
    "name": "Grosgrain Ribbon",
    "details": {
      "image_id": "refined-images/1773670024225470_4a9ecf57e1de4b97b03b340e994a80fd",
      "filter_data": {
        "Ribbon Style": [
          "Grosgrain"
        ],
        "Spool Length": [
          "Standard (20\\u201350 yards)",
          "Bulk (100 yards)"
        ],
        "Maximum Width": [
          "Narrow (up to 1.5 inch)"
        ],
        "Primary Use Case": [
          "Hairbow & Crafts",
          "Gift Wrapping & Packaging",
          "Floral & Bridal"
        ]
      },
      "product_key": "Grosgrain Ribbon",
      "manufacturer": "Morex Ribbon",
      "product_name": "Grosgrain Ribbon",
      "product_media": [
        {
          "url": "https://file-host.link/website/morexribbon-3ae2rn/assets/refined-images/1773670024225470_4a9ecf57e1de4b97b03b340e994a80fd/1080.webp"
        }
      ],
      "support_service": [
        "Customer service available at 800-466-7393",
        "Email support at orders@morexribbon.com",
        "Online catalog and resources available"
      ],
      "served_locations": [
        "USA"
      ],
      "shipping_returns": "Shipping and return details available upon request. Contact customer service at 800-466-7393 or via email at orders@morexribbon.com for specific shipping methods and return policies.",
      "key_features_usps": [
        "197 glorious colors and multiple widths available",
        "100% Polyester construction with colorfast properties",
        "Garment quality - washable and dry cleanable",
        "Tested according to Oeko-Tex Standard 100 for safety",
        "Available in multiple put-up options including 20-yard and 100-yard spools"
      ],
      "ownership_options": [
        "Purchase"
      ],
      "product_identifier": "066",
      "pricing_information": "Wholesale list pricing available. Multiple put-up options including 20-yard and 100-yard spools. MSRP varies by width and yardage. Contact customer service at 800-466-7393 or orders@morexribbon.com for specific pricing.",
      "applications_use_cases": [
        "Hairbow ribbon crafting",
        "Scrapbooking and paper crafts",
        "Fabric and sewing projects",
        "Floral arrangements and decorations",
        "Party ribbon and gift wrapping",
        "Bridal and prom accessories",
        "Baby shower and nursery decorations"
      ],
      "regulatory_information": [
        "All colors tested according to Oeko-Tex Standard 100"
      ],
      "associate_certifications": [],
      "technical_specifications": {
        "Material": "100% Polyester",
        "Color Range": "197 glorious colors available",
        "Available Widths": "3/8 inch, 5/8 inch, 7/8 inch, 1.5 inch",
        "Quality Standard": "Tested according to Oeko-Tex Standard 100",
        "Available Lengths": "20 yards, 100 yards",
        "Care Instructions": "Colorfast, Machine wash up to 140\\u00b0F/60\\u00b0C, No chlorine treatment, Iron up to 230\\u00b0F/110\\u00b0C, Dry cleanable, Reduced heat treatment in tumble-dryer"
      }
    }
  },
  {
    "name": "Metallic Ribbon",
    "details": {
      "product_key": "Metallic Ribbon",
      "manufacturer": "Morex Ribbon",
      "product_name": "Metallic Ribbon",
      "support_service": [
        "Customer service available at 800-466-7393",
        "Email support at orders@morexribbon.com",
        "Online catalog and product resources available"
      ],
      "served_locations": [
        "USA"
      ],
      "shipping_returns": "Shipping and return information available upon request. Contact customer service at 800-466-7393 or orders@morexribbon.com",
      "key_features_usps": [
        "Available in multiple metallic colors including gold, silver, and specialty finishes",
        "Offered in various widths from 3/8 inch to 3-1/2 inches for versatile applications",
        "Poly glitter construction provides sparkle and decorative appeal",
        "Available in bulk lengths up to 109 yards for high-volume use"
      ],
      "ownership_options": [
        "Purchase"
      ],
      "product_identifier": "185",
      "pricing_information": "Pricing Available on Request",
      "applications_use_cases": [
        "Gift wrapping and package decoration",
        "Holiday and seasonal decorations including Christmas",
        "Floral arrangements and bouquet embellishment",
        "Party and event decoration",
        "Craft and scrapbooking projects",
        "Bridal and wedding applications"
      ],
      "regulatory_information": [],
      "associate_certifications": [],
      "technical_specifications": {
        "Type": "Glittered curling ribbon",
        "Material": "Poly Glitter",
        "Width Options": "10mm (3/8 inch), 90mm (3-1/2 inch)",
        "Length Options": "100m (109 yards), 20m (22 yards)",
        "Available Colors": "631 Silver, 634 Gold, 523 Mocha, 623 Antique Gold, 609 Red, 613 Black",
        "Product Code 10mm": "185/9",
        "Product Code 90mm": "18590"
      }
    }
  },
  {
    "name": "Sheer Organdy Ribbon",
    "details": {
      "image_id": "refined-images/1773670032378674_3464e6ae4bf941769639a831da84bb63",
      "filter_data": {
        "Application": [
          "Bridal & Prom",
          "Hairbow & Crafts",
          "Gift Wrapping & Packaging",
          "Seasonal & Holiday"
        ],
        "Ribbon Type": [
          "Sheer/Organdy"
        ],
        "Material Base": [
          "Polyester"
        ],
        "Special Features": []
      },
      "product_key": "Sheer or Organza Ribbon",
      "manufacturer": "Morex Ribbon",
      "product_name": "Sheer Organdy Ribbon",
      "product_media": [
        {
          "url": "https://file-host.link/website/morexribbon-3ae2rn/assets/refined-images/1773670032378674_3464e6ae4bf941769639a831da84bb63/1080.webp"
        }
      ],
      "support_service": [
        "Customer service available at 800-466-7393",
        "Email support at orders@morexribbon.com",
        "Online catalog and product resources available at morexribbon.com"
      ],
      "served_locations": [
        "USA"
      ],
      "shipping_returns": "Shipping and return information available upon request from Morex Ribbon customer service at 800-466-7393 or orders@morexribbon.com",
      "key_features_usps": [
        "High-quality sheer organdy ribbon suitable for multiple applications",
        "Available in a wide variety of colors and widths",
        "Part of Morex Ribbon's extensive sheer ribbon collection including styles #918 Organdy, #938 Sheer Delight-Satin Edge, and #950 Sugar Sheer",
        "Suitable for baby, bridal/prom, floral, hairbow, party, and scrapbooking applications",
        "Colorfast and machine washable up to 140\\u00b0F/60\\u00b0C for select Swiss Satin styles"
      ],
      "ownership_options": [
        "Purchase"
      ],
      "product_identifier": "#918",
      "pricing_information": "Pricing Available on Request",
      "applications_use_cases": [
        "Baby products and gift wrapping",
        "Bridal and prom decorations",
        "Floral arrangements and bouquets",
        "Hairbow ribbon crafting",
        "Party decorations and gift packaging",
        "Scrapbooking and paper crafts",
        "Fabric and sewing projects"
      ],
      "regulatory_information": [
        "Select styles tested according to Oeko-Tex Standard 100 for textile safety"
      ],
      "associate_certifications": [
        "Oeko-Tex Standard 100"
      ],
      "technical_specifications": {
        "Material": "Sheer Organdy",
        "Edge_Type": "Monofilament edge available in some sheer styles",
        "Product_Type": "Sheer Ribbon",
        "Style_Number": "#918",
        "Available_Colors": "Multiple colors including White, Ivory, Pink, Blue, Red, Purple, Black, Lime, Aqua, and many others",
        "Available_Widths": "Multiple widths available"
      }
    }
  },
  {
    "name": "Velvet Ribbon",
    "details": {
      "image_id": "refined-images/1773669981256070_ea1da1372fb64341acbd33efd26cc499",
      "filter_data": {
        "Application": [
          "Bridal & Prom",
          "Hairbow & Crafts",
          "Gift Wrapping & Packaging",
          "Seasonal & Holiday"
        ],
        "Ribbon Type": [
          "Velvet"
        ],
        "Material Base": [
          "Polyester"
        ],
        "Special Features": []
      },
      "product_key": "Velvet Ribbon",
      "manufacturer": "Morex Ribbon",
      "product_name": "Velvet Ribbon",
      "product_media": [
        {
          "url": "https://file-host.link/website/morexribbon-3ae2rn/assets/refined-images/1773669981256070_ea1da1372fb64341acbd33efd26cc499/1080.webp"
        }
      ],
      "support_service": [
        "Customer service available at 800-466-7393",
        "Email support at orders@morexribbon.com"
      ],
      "served_locations": [
        "USA"
      ],
      "shipping_returns": "For more information call customer service department at 800-466-7393 or via email orders@morexribbon.com",
      "key_features_usps": [
        "Available in multiple widths and yardage options",
        "Part of Morex Ribbon's extensive product line with 197 glorious colors",
        "Suitable for various crafting and decorative applications",
        "High-quality velvet texture for premium appearance"
      ],
      "ownership_options": [
        "Purchase"
      ],
      "product_identifier": "012",
      "pricing_information": "Pricing Available on Request",
      "applications_use_cases": [
        "Bridal and Prom decorations",
        "Floral arrangements",
        "Scrapbooking projects",
        "Party decorations",
        "Baby shower decorations",
        "Fabric and sewing applications",
        "Hairbow creation",
        "Holiday decorations including Christmas, Halloween, Easter, and Valentines"
      ],
      "regulatory_information": null,
      "associate_certifications": null,
      "technical_specifications": {
        "Material": "100% Polyester",
        "Product_Type": "Nylvalour Velvet",
        "Style_Number": "012"
      }
    }
  },
  {
    "name": "Curling Ribbon",
    "details": {
      "image_id": "refined-images/1773669992562748_fbf5edc8a05249f7a6ea818738d14c42",
      "filter_data": {
        "Application": [
          "Gift Wrapping & Packaging",
          "Seasonal & Holiday",
          "Hairbow & Crafts"
        ],
        "Ribbon Type": [
          "Curling"
        ],
        "Material Base": [
          "Polypropylene"
        ],
        "Special Features": [
          "Curling/Crimped"
        ]
      },
      "product_key": "Curling Ribbon",
      "manufacturer": "Morex Ribbon",
      "product_name": "Curling Ribbon",
      "product_media": [
        {
          "url": "https://file-host.link/website/morexribbon-3ae2rn/assets/refined-images/1773669992562748_fbf5edc8a05249f7a6ea818738d14c42/1080.webp"
        }
      ],
      "support_service": [
        "Product catalog available for reference",
        "Wholesale customer support",
        "Retail location finder for purchasing"
      ],
      "served_locations": [
        "USA"
      ],
      "shipping_returns": "Shipping and return information available upon request through authorized distributors and retail partners.",
      "key_features_usps": [
        "Available in both crimped and smooth finishes for different curling effects",
        "Multiple packaging options including bulk spools up to 550 yards and convenient consumer eggs",
        "Wide color selection including solid colors and patriotic color combinations",
        "Versatile widths from 3/16 inch to 7/8 inch for various decorative applications",
        "Value-sized options with 6-channel spools providing up to 120 feet total"
      ],
      "ownership_options": [
        "Purchase"
      ],
      "product_identifier": "253",
      "pricing_information": "Wholesale pricing available. Special tray pricing ranges from $0.25 to $1.99 per piece depending on product configuration. Volume pricing available for bulk orders of 100-500 yards.",
      "applications_use_cases": [
        "Gift wrapping and package decoration",
        "Party decorations and event styling",
        "Floral arrangements and bouquet embellishment",
        "Craft projects and scrapbooking",
        "Patriotic decorations for holidays including Independence Day celebrations",
        "Retail packaging and product presentation"
      ],
      "regulatory_information": null,
      "associate_certifications": null,
      "technical_specifications": {
        "Material": "Poly (Polypropylene)",
        "Product_Type": "Crimped Curling Ribbon",
        "Style_Number": "253",
        "Package_Types": "Bulk spools, Consumer eggs, 6-channel spools",
        "Finish_Options": "Crimped, Smooth",
        "Available_Widths": "3/16 inch, 3/8 inch",
        "Available_Lengths": "500 yards, 550 yards, 250 yards, 100 yards, 75 feet, 66 feet",
        "Color_Availability": "Multiple colors including Red, White, Blue, Gold, Silver, and patriotic combinations"
      }
    }
  }
]`,
  paaDataJson: `[
  "Where can I buy high-quality Christmas ribbon from U.S. manufacturers?"
]`,
};

const CLIENT_PERFECT_IMPRINTS: ClientSample = {
  id: `f3bee843-b993-4a99-853f-b0256fbb0350`,
  slug: `perfect-imprints`,
  name: `Perfect Imprints`,
  url: `https://www.perfectimprints.com/`,
  primaryLogoUrl: `https://file-host.link/website/perfectimprints-od84er/assets/logo/logo.webp`,
  sampleServiceTopic: `Custom Promotional Products & Gifts in Knoxville TN`,
  sampleCategoryTopic: `Custom Mouse Pads - No Minimums`,
  sampleBlogTopic: `Event Planning for Bulk Orders: Q1 2026 Guide`,
  designTokensJson: `{
  "fonts": {
    "body_font_url": "https://fonts.googleapis.com/css2?family=Inter:wght@300..700&display=swap",
    "heading_font_url": "https://fonts.googleapis.com/css2?family=Urbanist:wght@300..700&display=swap"
  },
  "css_variables": {
    "--color-brand-text": "#111111",
    "--font-family-body": "Inter, ui-sans-serif, system-ui, sans-serif",
    "--color-brand-primary": "#E31B23",
    "--font-family-heading": "Urbanist, ui-sans-serif, system-ui, sans-serif",
    "--color-brand-secondary": "#1A1A1A",
    "--color-brand-text-muted": "#9A9A9A",
    "--color-brand-primary-dark": "#A01018",
    "--color-brand-text-inverse": "#ffffff",
    "--color-brand-text-primary": "#111111",
    "--color-brand-primary-hover": "#C4151C",
    "--color-brand-primary-light": "rgba(227, 27, 35, 0.05)",
    "--color-brand-text-tertiary": "#6B6B6B",
    "--color-brand-primary-medium": "rgba(227, 27, 35, 0.1)",
    "--color-brand-secondary-dark": "#000000",
    "--color-brand-text-secondary": "#3D3D3D",
    "--color-brand-secondary-hover": "#2E2E2E",
    "--color-brand-secondary-light": "rgba(26, 26, 26, 0.05)",
    "--color-brand-secondary-medium": "rgba(26, 26, 26, 0.1)",
    "--color-brand-primary-foreground": "#ffffff",
    "--color-brand-secondary-foreground": "#ffffff"
  }
}`,
  companyInfoJson: `{
  "name": {
    "dba_name": null,
    "legal_name": null,
    "company_name": "Perfect Imprints"
  },
  "founded": {
    "founded_date_year": null,
    "years_in_business": null
  },
  "locations": {
    "branch_locations": [],
    "headquarters_address": null
  },
  "credentials": {
    "memberships": [],
    "accreditations": [],
    "certifications": [],
    "business_licenses": []
  },
  "company_size": {
    "employee_count": null,
    "annual_turnover": null
  },
  "service_team": {
    "team_members": [],
    "employee_count": null,
    "years_of_experience": null
  },
  "company_story": {
    "milestones": [],
    "founding_story": null,
    "company_history": null,
    "growth_narrative": null
  },
  "phone_numbers": [
    "+1 850-200-4020"
  ],
  "service_areas": [],
  "working_hours": {
    "Friday": [
      "8AM-5PM"
    ],
    "Monday": [
      "8AM-5PM"
    ],
    "Sunday": [
      "Closed"
    ],
    "Tuesday": [
      "8AM-5PM"
    ],
    "Saturday": [
      "Closed"
    ],
    "Thursday": [
      "8AM-5PM"
    ],
    "Wednesday": [
      "8AM-5PM"
    ]
  },
  "email_addresses": [],
  "major_customers": [],
  "ratings_reviews": {
    "GBP": {
      "rating": 5,
      "review_count": 101
    }
  },
  "business_category": [
    "Screen printer",
    "Advertising agency",
    "Commercial printer",
    "Graphic designer",
    "Marketing agency",
    "Print shop",
    "Promotional products supplier",
    "Web hosting company",
    "Website designer"
  ],
  "target_geographies": [
    "us"
  ],
  "value_propositions": {
    "key_benefits": [],
    "market_positioning": null,
    "competitive_advantages": [],
    "unique_selling_propositions": []
  },
  "awards_recognitions": [],
  "social_media_profiles": {
    "other": [],
    "yelp_url": null,
    "twitter_url": null,
    "youtube_url": null,
    "facebook_url": null,
    "linkedin_url": null,
    "whatsapp_url": null,
    "instagram_url": null
  },
  "target_customer_segments": [
    "Automotive",
    "Church/Religious",
    "Health Care",
    "Banking & Financial",
    "Real Estate",
    "Microbreweries",
    "Education",
    "Non-Profit",
    "Construction",
    "Government",
    "Associations",
    "Professionals"
  ],
  "mission_statement_company_values": {
    "vision": null,
    "taglines": [
      "Custom Promotional Products & Corporate Gifts With Your Logo"
    ],
    "core_values": [],
    "mission_statement": null
  }
}`,
  additionalInfoJson: `{
  "business_profile": {
    "inventory_nature": "100% Whole Units - Finished promotional products available for custom branding/imprinting, sold in bulk quantities with minimum order requirements",
    "business_identity": "B2B promotional products distributor specializing in customizable branded merchandise including apparel, drinkware, bags, tech accessories, and trade show materials with logo imprinting services.",
    "primary_verticals": [
      "Apparel & Wearables",
      "Drinkware & Coolers",
      "Bags & Totes",
      "Technology & Electronics",
      "Trade Show & Event Displays",
      "Office & Writing Instruments",
      "Health & Wellness Products"
    ],
    "explicit_out_of_scope": [
      "Replacement Parts",
      "Repair Services",
      "Used/Refurbished Items",
      "Rentals",
      "Non-customizable retail goods",
      "Individual consumer sales (B2C retail)",
      "Raw materials or manufacturing components",
      "Installation services",
      "Medical equipment or pharmaceuticals",
      "Heavy machinery or industrial equipment"
    ]
  }
}`,
  logoUrlsJson: `{
  "favicon": "https://file-host.link/website/perfectimprints-od84er/assets/logo/1774616759255906_e681bf8e7b644878808b089e7da221dd.bin",
  "gbp_url": "https://file-host.link/website/perfectimprints-od84er/assets/logo/1774616473383754_b8d25c260e05400b83c933e21c3774cf.webp",
  "primary_logo": "https://file-host.link/website/perfectimprints-od84er/assets/logo/logo.webp"
}`,
  serviceCatalogJson: `[]`,
  productInformationJson: `[
  {
    "name": "Caps & Hats",
    "details": {
      "image_id": "refined-images/1774629792599226_6f49a0716b094981b7aa95585b00a57b",
      "filter_data": {
        "Primary Use Case": [
          "Corporate Branding",
          "Sports & School Spirit",
          "Employee & Client Appreciation"
        ],
        "Product Category": [
          "Apparel"
        ],
        "Customization Method": [
          "Embroidery",
          "Screen Printing"
        ],
        "Sustainability Features": []
      },
      "product_key": "Caps and Hats",
      "manufacturer": "Multiple Brands",
      "product_name": "Caps & Hats",
      "product_media": [
        {
          "url": "https://file-host.link/website/perfectimprints-od84er/assets/refined-images/1774629792599226_6f49a0716b094981b7aa95585b00a57b/1080.webp"
        }
      ],
      "support_service": [
        "Custom logo printing services available",
        "Product selection assistance"
      ],
      "served_locations": [
        "USA"
      ],
      "shipping_returns": "Shipping and return information available upon request",
      "key_features_usps": [
        "Wide variety of styles including beanies, visors, flat bill, and mesh caps",
        "Athletic and performance options with moisture-wicking technology",
        "Available in structured, military, and youth styles",
        "Customizable with logo printing for promotional purposes"
      ],
      "ownership_options": [
        "Purchase"
      ],
      "product_identifier": null,
      "pricing_information": "Pricing Available on Request",
      "applications_use_cases": [
        "Corporate branding and promotional merchandise",
        "Sports teams and athletic organizations",
        "Military and uniform applications",
        "Youth programs and schools",
        "Outdoor activities and performance wear"
      ],
      "regulatory_information": [],
      "associate_certifications": [],
      "technical_specifications": {
        "Features": "Moisture-wicking options available",
        "Age Groups": "Adult and Youth sizes available",
        "Categories": "Beanies, Athletic/Performance, Structured, Military, Visors, Flat Bill, Mesh, Youth"
      }
    }
  },
  {
    "name": "Camping Gear",
    "details": {
      "product_key": "Camping Outdoor Gear",
      "manufacturer": null,
      "product_name": "Camping Gear",
      "support_service": [],
      "served_locations": [],
      "shipping_returns": null,
      "key_features_usps": [
        "Outdoor adventure essentials for camping activities",
        "Suitable for various outdoor recreational uses",
        "Available in multiple product categories and configurations"
      ],
      "ownership_options": [
        "Purchase"
      ],
      "product_identifier": null,
      "pricing_information": "Pricing Available on Request",
      "applications_use_cases": [
        "Camping and outdoor recreation",
        "Outdoor adventures and activities",
        "Beach and outdoor leisure activities"
      ],
      "regulatory_information": [],
      "associate_certifications": [],
      "technical_specifications": {}
    }
  },
  {
    "name": "Custom Drinkware",
    "details": {
      "image_id": "refined-images/1774629770180775_65a16f5ee8b94b0298b1354a3b54cd5b",
      "filter_data": {
        "Material Options": [
          "Stainless Steel",
          "Plastic & Vinyl"
        ],
        "Primary Use Case": [
          "Corporate Branding",
          "Employee & Client Appreciation",
          "Trade Shows & Events"
        ],
        "Product Category": [
          "Drinkware"
        ],
        "Application Setting": [
          "Camping & Outdoors",
          "Corporate Events",
          "Sports & Athletics"
        ],
        "Customization Method": [
          "Laser Engraving",
          "Screen Printing",
          "Full-Color Digital Print"
        ],
        "Sustainability Features": []
      },
      "product_key": "Custom Drinkware",
      "manufacturer": "Multiple Manufacturers",
      "product_name": "Custom Drinkware",
      "product_media": [
        {
          "url": "https://file-host.link/website/perfectimprints-od84er/assets/refined-images/1774629770180775_65a16f5ee8b94b0298b1354a3b54cd5b/1080.webp"
        }
      ],
      "support_service": [
        "Design and customization services available",
        "Quote request service",
        "Sample ordering available",
        "Proof request service for custom designs",
        "Technical support via contact form"
      ],
      "served_locations": [
        "USA"
      ],
      "shipping_returns": "Standard production time: 5 days. Rush production available for select items. Shipping costs calculated at checkout. Return policies vary by product and customization.",
      "key_features_usps": [
        "High-quality stainless steel construction with vibrant powder coating for durability",
        "Vacuum insulation keeps drinks cold for up to 24 hours",
        "Wide variety of drinkware types including tumblers, water bottles, coffee mugs, stadium cups, koozies, and barware",
        "Customizable with multiple decoration methods including laser engraving, screen printing, and full color printing",
        "Kid-friendly designs available with spill-proof features"
      ],
      "ownership_options": [
        "Purchase"
      ],
      "product_identifier": null,
      "pricing_information": "Price range varies by product type and quantity. Example pricing: 14 oz water bottle at $32.73 for 1 unit, $22.00 for 576 units. 20 oz tumbler at $21.84 for 48 units, $14.92 for 576 units. Volume and custom pricing available upon request.",
      "applications_use_cases": [
        "Corporate branding and promotional giveaways",
        "Trade show and event marketing materials",
        "Employee appreciation and client gifts",
        "Sports teams and athletic events",
        "Restaurants, bars, and hospitality industry",
        "Outdoor activities including camping, biking, and travel"
      ],
      "regulatory_information": [
        "Food-grade materials compliant with safety standards",
        "BPA-free options available"
      ],
      "associate_certifications": null,
      "technical_specifications": {
        "Features": "Sweatproof, odor-free, easy to clean",
        "Insulation": "Vacuum insulated options available, keeps drinks cold up to 24 hours or hot for hours",
        "Lid Options": "Spill-proof straw lids, standard lids",
        "Construction": "18/8 food-grade stainless steel, durable powder coating",
        "Capacity Range": "14 oz to 20 oz and larger",
        "Material Options": "Stainless Steel, Acrylic, Plastic, Glass, Aluminum"
      }
    }
  },
  {
    "name": "Winter Promotional Items",
    "details": {
      "image_id": "refined-images/1774629738645322_9c3840ef671d4229b9462b632f572ae8",
      "filter_data": {
        "Primary Use Case": [
          "Seasonal & Holiday",
          "Corporate Branding",
          "Employee & Client Appreciation"
        ],
        "Product Category": [
          "Apparel",
          "Drinkware"
        ],
        "Customization Method": [
          "Embroidery",
          "Screen Printing",
          "Full-Color Digital Print"
        ],
        "Sustainability Features": [
          "Made in USA",
          "Recycled Materials"
        ]
      },
      "product_key": "Winter Promotional Items",
      "manufacturer": "Perfect Imprints",
      "product_name": "Winter Promotional Items",
      "product_media": [
        {
          "url": "https://file-host.link/website/perfectimprints-od84er/assets/refined-images/1774629738645322_9c3840ef671d4229b9462b632f572ae8/1080.webp"
        }
      ],
      "support_service": [
        "Design & Buy service available",
        "Quote Request service",
        "Order Sample option",
        "Request Proof service",
        "Contact support for multi-color printing cost and capabilities"
      ],
      "served_locations": [
        "USA",
        "Canada"
      ],
      "shipping_returns": "Standard delivery times and shipping methods vary by product. Tax and shipping calculated at checkout. Return policies available upon request.",
      "key_features_usps": [
        "Wide variety of winter-themed promotional products available",
        "Customizable with company logos and branding",
        "Made in USA options available to avoid tariff increases",
        "Multiple decoration methods including embroidery and full-color printing",
        "Suitable for corporate gifts, awareness campaigns, and seasonal marketing"
      ],
      "ownership_options": [
        "Purchase"
      ],
      "product_identifier": null,
      "pricing_information": "Pricing varies by product and quantity. Volume and custom pricing available upon request. Products are priced Blank or Decorated with most decorated products priced considering a 1 color imprint.",
      "applications_use_cases": [
        "Corporate holiday gifts and employee appreciation",
        "Winter marketing campaigns and brand awareness",
        "Trade shows and promotional events during winter season",
        "Customer appreciation and loyalty programs",
        "Seasonal awareness campaigns including EMS Week, Fire Prevention Week, and National Nurses Week"
      ],
      "regulatory_information": [],
      "associate_certifications": [],
      "technical_specifications": {
        "Season": "Winter",
        "Customization": "Available with decoration methods including embroidery, silkscreen, and full-color printing",
        "Material Options": "Various including cotton, stainless steel, plastic, leather, and recycled materials",
        "Product Category": "Promotional Items"
      }
    }
  },
  {
    "name": "Custom Wellness Products",
    "details": {
      "image_id": "refined-images/1774629740125500_362681078921485fb00bd95e155578f8",
      "filter_data": {
        "Primary Use Case": [
          "Corporate Branding",
          "Employee & Client Appreciation",
          "Awareness Campaigns"
        ],
        "Product Category": [
          "Wellness & Safety"
        ],
        "Customization Method": [
          "Screen Printing",
          "Full-Color Digital Print"
        ],
        "Sustainability Features": []
      },
      "product_key": "Custom Wellness",
      "manufacturer": "Perfect Imprints",
      "product_name": "Custom Wellness Products",
      "product_media": [
        {
          "url": "https://file-host.link/website/perfectimprints-od84er/assets/refined-images/1774629740125500_362681078921485fb00bd95e155578f8/1080.webp"
        }
      ],
      "support_service": [],
      "served_locations": [
        "USA"
      ],
      "shipping_returns": "Shipping and return information available upon request",
      "key_features_usps": [
        "Comprehensive wellness and safety product line including first aid kits, personal protection equipment, and fitness items",
        "Custom branding and promotional options available for corporate wellness programs",
        "Wide range of safety apparel including safety shirts, vests, jackets, hats, and gloves",
        "Personal care items including hand sanitizer, lip balm, sunscreen, and insect repellent",
        "Fitness and wellness accessories including resistance bands, yoga items, pedometers, and jump ropes"
      ],
      "ownership_options": [
        "Purchase"
      ],
      "product_identifier": null,
      "pricing_information": "Pricing Available on Request",
      "applications_use_cases": [
        "Corporate wellness programs and employee health initiatives",
        "Workplace safety compliance and personal protection",
        "Promotional giveaways and branded merchandise for health-focused campaigns",
        "Emergency preparedness and first aid response",
        "Fitness centers, gyms, and wellness facilities"
      ],
      "regulatory_information": [],
      "associate_certifications": [],
      "technical_specifications": {}
    }
  },
  {
    "name": "Custom Apparel",
    "details": {
      "image_id": "refined-images/1774629738537438_9cd4f98e9a094c58afca79469bdc5324",
      "filter_data": {
        "Primary Use Case": [
          "Corporate Branding",
          "Employee & Client Appreciation",
          "Sports & School Spirit"
        ],
        "Product Category": [
          "Apparel"
        ],
        "Customization Method": [
          "Embroidery",
          "Screen Printing"
        ],
        "Sustainability Features": []
      },
      "product_key": "Custom Apparel",
      "manufacturer": "Perfect Imprints",
      "product_name": "Custom Apparel",
      "product_media": [
        {
          "url": "https://file-host.link/website/perfectimprints-od84er/assets/refined-images/1774629738537438_9cd4f98e9a094c58afca79469bdc5324/1080.webp"
        }
      ],
      "support_service": null,
      "served_locations": null,
      "shipping_returns": null,
      "key_features_usps": [
        "Wide variety of apparel categories including T-shirts, polo shirts, sweatshirts, jackets, caps, and workwear",
        "Custom screen printing and embroidery services available for business branding",
        "Performance and moisture-wicking options for athletic and active wear",
        "Specialized workwear including medical scrubs, industrial work shirts, and safety gear",
        "Options for men's, women's, and youth sizes across multiple product lines"
      ],
      "ownership_options": [
        "Purchase"
      ],
      "product_identifier": null,
      "pricing_information": "Pricing Available on Request",
      "applications_use_cases": [
        "Corporate branding and employee uniforms",
        "Sports teams and athletic organizations",
        "Promotional merchandise and marketing campaigns",
        "Medical and healthcare facilities",
        "Industrial and construction workwear",
        "Restaurant and hospitality uniforms",
        "School and youth organizations"
      ],
      "regulatory_information": null,
      "associate_certifications": null,
      "technical_specifications": {
        "Customization": "Screen Printing, Custom Embroidery Available",
        "Gender Options": "Men's, Women's, Youth",
        "Material Options": "Cotton, Moisture-Wicking Performance Fabrics, Fleece, Mesh, Easy Care Fabrics",
        "Product Categories": "T-Shirts (Short Sleeve, Long Sleeve, V-Neck, Tank Tops), Polo Shirts (Cotton, Performance, Easy Care), Sweatshirts (Pullover, Full Zip, Hoodies), Jackets (Soft Shell, Rain Jackets, Vests), Collared Shirts, Caps & Hats, Workwear (Medical/Scrubs, Industrial Work Shirts, Safety Gear)"
      }
    }
  },
  {
    "name": "Custom Pet Accessories",
    "details": {
      "image_id": "refined-images/1774629759752890_a9fcb5bf570c42ab9bb7e6cdf826e6b8",
      "filter_data": {
        "Primary Use Case": [
          "Corporate Branding",
          "Employee & Client Appreciation"
        ],
        "Product Category": [
          "Pet Accessories"
        ],
        "Customization Method": [
          "Screen Printing",
          "Full-Color Digital Print"
        ],
        "Sustainability Features": []
      },
      "product_key": "Custom Pet Accessories",
      "manufacturer": "Perfect Imprints",
      "product_name": "Custom Pet Accessories",
      "product_media": [
        {
          "url": "https://file-host.link/website/perfectimprints-od84er/assets/refined-images/1774629759752890_a9fcb5bf570c42ab9bb7e6cdf826e6b8/1080.webp"
        }
      ],
      "support_service": [
        "Contact customer service for pricing and multi-color printing capabilities",
        "Design and Buy service available",
        "Quote Request option",
        "Order Sample service",
        "Request Proof service"
      ],
      "served_locations": [
        "USA"
      ],
      "shipping_returns": "Shipping and tax calculated at checkout. Lead times vary by product (e.g., 15 days for Collapsible Pet Bowl). Return policies and warranty information available upon request.",
      "key_features_usps": [
        "Wide variety of customizable pet accessories including bowls, collars, leashes, toys, treats, and waste bag dispensers",
        "Products feature practical designs such as collapsible bowls with zippered openings and PEVA-lined compartments for easy cleaning",
        "Ideal for promotional giveaways, retail stores, community events, and pet-related businesses",
        "Custom branding available with various decoration methods to showcase company logos"
      ],
      "ownership_options": [
        "Purchase"
      ],
      "product_identifier": null,
      "pricing_information": "Pricing varies by product. Example: Collapsible Pet Bowl priced at $2,975.00 for quantity of 1 with $50.00 default decoration. Volume and custom pricing available upon request.",
      "applications_use_cases": [
        "Promotional gifts for dog owners and pet enthusiasts",
        "Retail merchandise for pet stores and veterinary clinics",
        "Corporate giveaways for pet-related businesses and events",
        "Community events and pet adoption drives",
        "Custom branded accessories for pet service providers"
      ],
      "regulatory_information": [],
      "associate_certifications": [],
      "technical_specifications": {
        "Available_Items": "Bowls, Collars, Leashes, Dog Toys, Treats, Waste Bag Dispensers",
        "Product_Category": "Pet Accessories",
        "Example_Product_Features": "Collapsible design, Zippered opening, Two separate compartments with PEVA lined interior for easy cleaning, Front slash pocket"
      }
    }
  },
  {
    "name": "Custom Chocolate",
    "details": {
      "image_id": "refined-images/1774629734030644_fa013625589b451eaeb87f3b31703cd8",
      "filter_data": {
        "Primary Use Case": [
          "Employee & Client Appreciation",
          "Seasonal & Holiday",
          "Trade Shows & Events"
        ],
        "Product Category": [
          "Food & Edibles"
        ],
        "Customization Method": [
          "Full-Color Digital Print"
        ],
        "Sustainability Features": []
      },
      "product_key": "Custom Chocolates",
      "manufacturer": "Perfect Imprints",
      "product_name": "Custom Chocolate",
      "product_media": [
        {
          "url": "https://file-host.link/website/perfectimprints-od84er/assets/refined-images/1774629734030644_fa013625589b451eaeb87f3b31703cd8/1080.webp"
        }
      ],
      "support_service": [],
      "served_locations": [
        "USA"
      ],
      "shipping_returns": null,
      "key_features_usps": [
        "Customizable with company logo or branding",
        "Available as part of gift baskets and gift sets",
        "Suitable for corporate gifts and promotional events",
        "High-quality chocolate products for brand visibility"
      ],
      "ownership_options": [
        "Purchase"
      ],
      "product_identifier": null,
      "pricing_information": "Pricing Available on Request",
      "applications_use_cases": [
        "Corporate gifts and employee appreciation",
        "Holiday and seasonal promotional campaigns",
        "Client appreciation and business development",
        "Trade show giveaways and event marketing",
        "End of year gifts and Christmas presents"
      ],
      "regulatory_information": [],
      "associate_certifications": [],
      "technical_specifications": {}
    }
  },
  {
    "name": "Custom School Spirit",
    "details": {
      "image_id": "refined-images/1774629735634907_c6a77c33589b45ba8fe2254f5c1aaff2",
      "filter_data": {
        "Primary Use Case": [
          "Sports & School Spirit",
          "Trade Shows & Events"
        ],
        "Product Category": [
          "Apparel",
          "Outdoor & Sporting"
        ],
        "Customization Method": [
          "Screen Printing",
          "Full-Color Digital Print"
        ],
        "Sustainability Features": []
      },
      "product_key": "Custom School Spirit",
      "manufacturer": "Perfect Imprints",
      "product_name": "Custom School Spirit",
      "product_media": [
        {
          "url": "https://file-host.link/website/perfectimprints-od84er/assets/refined-images/1774629735634907_c6a77c33589b45ba8fe2254f5c1aaff2/1080.webp"
        }
      ],
      "support_service": null,
      "served_locations": null,
      "shipping_returns": null,
      "key_features_usps": [
        "Wide variety of team spirit items including foam fingers, sports balls, and stadium accessories",
        "Customizable products for multiple sports including basketball, football, baseball, soccer, and volleyball",
        "Comprehensive school spirit product line including megaphones, pennants, pom poms, and thundersticks",
        "Available in both mini and full-size options for sports balls",
        "Includes apparel and accessories for various sports activities"
      ],
      "ownership_options": [
        "Purchase"
      ],
      "product_identifier": null,
      "pricing_information": "Pricing Available on Request",
      "applications_use_cases": [
        "School sporting events and pep rallies",
        "Team spirit promotion and school fundraisers",
        "Athletic department merchandise and fan engagement",
        "College and university spirit programs",
        "Youth sports leagues and recreational activities"
      ],
      "regulatory_information": null,
      "associate_certifications": null,
      "technical_specifications": {}
    }
  },
  {
    "name": "Custom Awareness Gifts",
    "details": {
      "image_id": "refined-images/1774629757248459_88c83b9a031743b5883aaaea58f39b7a",
      "filter_data": {
        "Primary Use Case": [
          "Awareness Campaigns",
          "Employee & Client Appreciation",
          "Corporate Branding"
        ],
        "Product Category": [
          "Wellness & Safety",
          "Apparel"
        ],
        "Customization Method": [
          "Screen Printing",
          "Full-Color Digital Print"
        ],
        "Sustainability Features": []
      },
      "product_key": "Custom Awareness Gifts",
      "manufacturer": "Perfect Imprints",
      "product_name": "Custom Awareness Gifts",
      "product_media": [
        {
          "url": "https://file-host.link/website/perfectimprints-od84er/assets/refined-images/1774629757248459_88c83b9a031743b5883aaaea58f39b7a/1080.webp"
        }
      ],
      "support_service": [
        "Custom design assistance",
        "Product selection guidance"
      ],
      "served_locations": [
        "USA"
      ],
      "shipping_returns": "Shipping and return information available upon request",
      "key_features_usps": [
        "Customizable promotional items for awareness campaigns",
        "Wide variety of product categories available",
        "Suitable for multiple awareness themes including EMS Week, Fire Prevention Week, Breast Cancer Awareness, National Doctors' Day, National Safety Month, National Nurses Week, Teacher Appreciation Week, National Truck Driver Awareness Week, Brain Awareness Week, and Earth Day",
        "Brand visibility through custom imprinting"
      ],
      "ownership_options": [
        "Purchase"
      ],
      "product_identifier": null,
      "pricing_information": "Pricing Available on Request",
      "applications_use_cases": [
        "EMS Week promotional campaigns",
        "Fire Prevention Week awareness events",
        "Breast Cancer Awareness fundraising and education",
        "National Doctors' Day recognition gifts",
        "National Safety Month corporate safety programs",
        "National Nurses Week appreciation gifts",
        "Teacher Appreciation Week school events",
        "National Truck Driver Awareness Week industry recognition",
        "Brain Awareness Week educational initiatives",
        "Earth Day environmental campaigns",
        "Healthcare industry promotional items",
        "Education sector awareness programs",
        "Non-profit organization fundraising",
        "Government agency public awareness campaigns"
      ],
      "regulatory_information": [],
      "associate_certifications": [],
      "technical_specifications": {}
    }
  },
  {
    "name": "Custom Trade Shows",
    "details": {
      "image_id": "refined-images/1774629735404149_90644279229f43438a7c8cb61184286b",
      "filter_data": {
        "Primary Use Case": [
          "Trade Shows & Events",
          "Corporate Branding"
        ],
        "Product Category": [
          "Trade Show & Displays",
          "Bags"
        ],
        "Customization Method": [
          "Screen Printing",
          "Full-Color Digital Print"
        ],
        "Sustainability Features": []
      },
      "product_key": "Custom Trade Shows",
      "manufacturer": "Perfect Imprints",
      "product_name": "Custom Trade Shows",
      "product_media": [
        {
          "url": "https://file-host.link/website/perfectimprints-od84er/assets/refined-images/1774629735404149_90644279229f43438a7c8cb61184286b/1080.webp"
        }
      ],
      "support_service": null,
      "served_locations": null,
      "shipping_returns": null,
      "key_features_usps": [
        "Comprehensive trade show product offerings including tote bags, table covers, and retractable banners",
        "Custom branding options for booth displays including floor displays and table top displays",
        "Wide range of promotional items including lanyards, pins, buttons, and trash can covers",
        "Multiple banner options including retractable banners, banner flags, and exhibit displays",
        "Complete trade show solutions from signage to promotional accessories"
      ],
      "ownership_options": [
        "Purchase"
      ],
      "product_identifier": null,
      "pricing_information": "Pricing Available on Request",
      "applications_use_cases": [
        "Trade show booth displays and exhibitions",
        "Corporate events and promotional campaigns",
        "Brand visibility and marketing at conventions",
        "Professional presentations and product showcases"
      ],
      "regulatory_information": null,
      "associate_certifications": null,
      "technical_specifications": null
    }
  },
  {
    "name": "Promotional Products",
    "details": {
      "image_id": "refined-images/1774629783927189_c074083dd78e4f4fbc9190ae0f964702",
      "filter_data": {
        "Primary Use Case": [
          "Corporate Branding",
          "Trade Shows & Events",
          "Employee & Client Appreciation",
          "Awareness Campaigns",
          "Seasonal & Holiday"
        ],
        "Product Category": [
          "Bags",
          "Drinkware",
          "Apparel"
        ],
        "Customization Method": [
          "Embroidery",
          "Screen Printing",
          "Laser Engraving",
          "Full-Color Digital Print"
        ],
        "Sustainability Features": [
          "Recycled Materials",
          "FSC Certified",
          "Made in USA",
          "Sustainable Fabrics"
        ]
      },
      "product_key": "Promotional Products",
      "manufacturer": "Multiple Manufacturers",
      "product_name": "Promotional Products",
      "product_media": [
        {
          "url": "https://file-host.link/website/perfectimprints-od84er/assets/refined-images/1774629783927189_c074083dd78e4f4fbc9190ae0f964702/1080.webp"
        }
      ],
      "support_service": [
        "Free digital proofs for logo and design approval",
        "Custom design and artwork services available",
        "Quote request and sample ordering options",
        "Technical support for product selection and decoration methods",
        "Volume pricing consultation for bulk orders"
      ],
      "served_locations": [
        "USA",
        "Canada"
      ],
      "shipping_returns": "Lead times range from 5 to 10 days depending on product. Rush production available on select items. Standard delivery methods include ground and freight shipping. Return policies vary by product and supplier.",
      "key_features_usps": [
        "Wide variety of customizable promotional products including apparel, drinkware, bags, office supplies, and specialty items",
        "Eco-friendly options available including sustainable fabrics made from recycled materials and FSC certified products",
        "Multiple decoration methods including embroidery, screen printing, laser engraving, and full-color digital printing",
        "Tiered pricing with volume discounts and bulk ordering options for cost-effective promotional campaigns",
        "Made in USA products available to avoid tariff increases and support domestic manufacturing"
      ],
      "ownership_options": [
        "Purchase"
      ],
      "product_identifier": null,
      "pricing_information": "Price range varies by product from $0.13 to $57.90. Volume and bulk pricing available with tiered quantity breaks. Custom pricing available upon request.",
      "applications_use_cases": [
        "Corporate branding and marketing campaigns with custom logo imprinted items",
        "Trade shows and promotional events with giveaway items like pens, bags, and drinkware",
        "Employee recognition and appreciation programs including apparel and gift sets",
        "Healthcare and medical facilities with scrubs, uniforms, and medical accessories",
        "Seasonal and holiday promotions including Christmas ornaments and themed items",
        "Awareness campaigns for causes like Breast Cancer Awareness, EMS Week, and National Nurses Week"
      ],
      "regulatory_information": [
        "FSC Certified products available for responsible forestry sourcing",
        "Sustainable and eco-friendly materials including recycled plastics and organic fabrics",
        "Products comply with standard safety regulations for their respective categories"
      ],
      "associate_certifications": [
        "FSC Certified"
      ],
      "technical_specifications": {
        "Materials": "Bamboo, Cotton, Polyester, Plastic, Metal, rABS, Silicone",
        "Weight_Range": "0.1 LB to 0.7 LB depending on product",
        "Dimensions_Range": "Varies by product - examples include 0.375H x 6W x 9D IN (cutting board), 1.22H x 1.95W x 3.23D IN (power bank)",
        "Decoration_Methods": "Silk Screen, Embroidery, Laser Engraving, Full-Color Digital Print, VividPrint",
        "Product_Categories": "Bags, Drinkware, Apparel, Office Supplies, Health & Wellness, Pet Accessories, Food & Beverage"
      }
    }
  },
  {
    "name": "Custom Home",
    "details": {
      "product_key": "Custom Home Accessories",
      "manufacturer": null,
      "product_name": "Custom Home",
      "support_service": [],
      "served_locations": [],
      "shipping_returns": null,
      "key_features_usps": [],
      "ownership_options": [],
      "product_identifier": null,
      "pricing_information": "Pricing Available on Request",
      "applications_use_cases": [],
      "regulatory_information": [],
      "associate_certifications": [],
      "technical_specifications": {}
    }
  },
  {
    "name": "Promotional Products Collection",
    "details": {
      "image_id": "refined-images/1774629808512053_4e43dfbbbf23441987b79921731533eb",
      "filter_data": {
        "Primary Use Case": [
          "Corporate Branding",
          "Trade Shows & Events",
          "Employee & Client Appreciation",
          "Awareness Campaigns",
          "Seasonal & Holiday"
        ],
        "Product Category": [
          "Drinkware",
          "Bags",
          "Apparel",
          "Wellness & Safety",
          "Pet Accessories"
        ],
        "Customization Method": [
          "Embroidery",
          "Screen Printing",
          "Laser Engraving",
          "Full-Color Digital Print"
        ],
        "Sustainability Features": [
          "Recycled Materials",
          "FSC Certified",
          "Made in USA",
          "Eco-Friendly Packaging"
        ]
      },
      "product_key": "Promotional Products Collection",
      "manufacturer": "Multiple Manufacturers",
      "product_name": "Promotional Products Collection",
      "product_media": [
        {
          "url": "https://file-host.link/website/perfectimprints-od84er/assets/refined-images/1774629808512053_4e43dfbbbf23441987b79921731533eb/1080.webp"
        }
      ],
      "support_service": [
        "Custom design and decoration services available",
        "Quote request service for bulk orders",
        "Sample ordering available for product evaluation",
        "Proof request service before production",
        "Technical support for product selection and customization",
        "Contact support for multi-color printing and custom capabilities"
      ],
      "served_locations": [
        "USA"
      ],
      "shipping_returns": "Lead time ranges from 3 to 10 days depending on product and decoration method. Rush production available on select items (1-3 days). Standard shipping and freight options available. Calculate tax and shipping at checkout. Return policies vary by product.",
      "key_features_usps": [
        "Wide variety of promotional products including drinkware, bags, apparel, and technology items from multiple brands",
        "Made in USA options available to avoid tariff increases with domestic manufacturing",
        "Eco-friendly and sustainable product options including FSC certified and recycled materials",
        "Custom decoration services with multiple imprint methods including silk screen, embroidery, and laser engraving",
        "Volume pricing and bulk discounts available with quantity breaks starting as low as 25 units"
      ],
      "ownership_options": [
        "Purchase"
      ],
      "product_identifier": null,
      "pricing_information": "Price range varies by product from $0.86 to $75.00 per unit. Volume and bulk pricing available with quantity discounts. Decorated pricing includes one-color imprint. Custom pricing available upon request.",
      "applications_use_cases": [
        "Corporate branding and marketing campaigns",
        "Trade shows and promotional events",
        "Employee recognition and appreciation programs including EMS Week, National Nurses Week, Teacher Appreciation Week",
        "Holiday and seasonal promotions including Christmas, Halloween, and Patriotic Holidays",
        "Healthcare and medical facilities promotional items including scrubs and medical accessories",
        "Awareness campaigns including Breast Cancer Awareness, Earth Day, and Fire Prevention Week",
        "Retail and restaurant promotional giveaways"
      ],
      "regulatory_information": [
        "FSC Certified products support responsible forestry management",
        "Made in USA products comply with domestic manufacturing standards",
        "Eco-friendly products made from recycled materials and sustainable sources",
        "Food-safe materials for drinkware and food contact items"
      ],
      "associate_certifications": [
        "FSC Certified",
        "Made in USA"
      ],
      "technical_specifications": {
        "Material Options": "rABS, Silicone, FSC Bamboo, Non-woven Polypropylene, Cotton, Recycled Materials, Stainless Steel, Leather",
        "Decoration Methods": "Silk Screen, Laser Engraving, Embroidery, Full-Color Printing, Heat Transfer",
        "Product Categories": "Drinkware, Bags & Coolers, Apparel, Office Supplies, Health & Wellness, Pet Accessories, Food & Beverage, Technology Items",
        "Eco-Friendly Options": "Recycled materials, FSC certified products, Sustainable fabric options",
        "Minimum Order Quantities": "Varies by product from 1 to 5000 units"
      }
    }
  },
  {
    "name": "Beach Chairs",
    "details": {
      "product_key": "Beach Chairs",
      "manufacturer": null,
      "product_name": "Beach Chairs",
      "support_service": null,
      "served_locations": [
        "USA"
      ],
      "shipping_returns": null,
      "key_features_usps": [
        "Custom promotional beach chairs available",
        "Folding design for portability and easy storage",
        "Beach-themed outdoor furniture suitable for promotional use"
      ],
      "ownership_options": [
        "Purchase"
      ],
      "product_identifier": null,
      "pricing_information": "Pricing Available on Request",
      "applications_use_cases": [
        "Beach events and outdoor activities",
        "Promotional giveaways and corporate branding",
        "Outdoor recreation and leisure activities"
      ],
      "regulatory_information": null,
      "associate_certifications": null,
      "technical_specifications": {
        "Type": "Outdoor Seating",
        "Theme": "Beach",
        "Product Category": "Folding Chairs"
      }
    }
  },
  {
    "name": "Custom Bags",
    "details": {
      "image_id": "refined-images/1774629768343617_8b187c6b3a2e4bf6bc04a4c02e901f0a",
      "filter_data": {
        "Material Options": [
          "Canvas & Fabric",
          "Paper",
          "Plastic & Vinyl"
        ],
        "Primary Use Case": [
          "Corporate Branding",
          "Trade Shows & Events",
          "Employee & Client Appreciation"
        ],
        "Product Category": [
          "Bags"
        ],
        "Application Setting": [
          "Camping & Outdoors",
          "Corporate Events",
          "Sports & Athletics",
          "Festivals & Parades"
        ],
        "Customization Method": [
          "Embroidery",
          "Screen Printing",
          "Full-Color Digital Print"
        ],
        "Sustainability Features": [
          "Recycled Materials",
          "Eco-Friendly Packaging"
        ]
      },
      "product_key": "Custom Bags",
      "manufacturer": "Perfect Imprints",
      "product_name": "Custom Bags",
      "product_media": [
        {
          "url": "https://file-host.link/website/perfectimprints-od84er/assets/refined-images/1774629768343617_8b187c6b3a2e4bf6bc04a4c02e901f0a/1080.webp"
        }
      ],
      "support_service": [
        "Design and Buy service available",
        "Quote Request service",
        "Order Sample service",
        "Request Proof service for custom designs",
        "Contact support for multi-color printing capabilities and pricing"
      ],
      "served_locations": [
        "USA"
      ],
      "shipping_returns": "Lead times vary by product: Standard lead time 6-10 days depending on item. Rush production available on select items. Shipping and tax calculated at checkout. Return policies and warranty information available upon request.",
      "key_features_usps": [
        "Custom printing available with full-color decoration on multiple sides",
        "Wide variety of bag types including backpacks, coolers, laptop cases, drawstring bags, waterproof bags, grocery bags, and paper bags",
        "Eco-friendly options available including recyclable paper bags",
        "Multiple decoration methods including embroidery, screen printing, and full-color printing",
        "Volume pricing available with quantity discounts for bulk orders"
      ],
      "ownership_options": [
        "Purchase"
      ],
      "product_identifier": null,
      "pricing_information": "Price range varies by product type and quantity. Example pricing: Wet wipes $0.13-$0.15 per unit for 5,000-25,000 quantity. SOS Paper Bags $0.92-$1.52 per unit for 100-1,000 quantity. Volume and custom pricing available upon request. Most products priced considering 1 color imprint, with multi-color printing cost available on request.",
      "applications_use_cases": [
        "Promotional giveaways and corporate branding events",
        "Retail packaging for merchandise and grocery stores",
        "Trade shows and special events for brand showcasing",
        "Restaurant and food service carry-out packaging",
        "School, work, and travel use for backpacks and laptop cases",
        "Outdoor activities and sports events with coolers and waterproof bags"
      ],
      "regulatory_information": [
        "Eco-friendly recyclable materials available for paper bags",
        "Country of origin varies by product (USA, China)"
      ],
      "associate_certifications": null,
      "technical_specifications": {
        "Bag Types": "Backpacks, Coolers, Laptop Cases, Drawstring Bags, Waterproof Bags, Grocery Bags, Plastic Bags, Paper Bags, Tote Bags",
        "Cooler Types": "Soft-Sided, Hard-Sided, 6-11 Can, 12-23 Can, 24+ Can capacity",
        "Cooler Brands": "Igloo, Coleman",
        "Paper Bag Types": "Merchandise Bags, Grocery Bags, Popcorn Bags, Wine Bags, Prescription Bags, Carry Out/Food Service Bags, Euro Totes",
        "Material Options": "Paper, Plastic, Vinyl, Canvas, Denim, Suede, Jersey Knit, Burlap, Metallic",
        "Backpack Features": "Clear Security, Computer compartments, Travel, Drawstring, School, Slings, Cooler integration, Premium options",
        "Plastic Bag Types": "Clear/Security, Cotton Cord, Door Knob, Frosted Shoppers",
        "SOS Paper Bag Dimensions": "5 inch x 16 inch x 3.125 inch (example)"
      }
    }
  },
  {
    "name": "Custom Office",
    "details": {
      "product_key": "Custom Office Accessories",
      "manufacturer": null,
      "product_name": "Custom Office",
      "support_service": [
        "Quote Request",
        "Order Sample",
        "Request Proof",
        "Design & Buy"
      ],
      "served_locations": [
        "USA"
      ],
      "shipping_returns": "Shipping and return policies vary by product. Standard delivery times and return windows apply. Contact for specific product details.",
      "key_features_usps": [
        "Customizable promotional products for office environments",
        "Wide range of office supplies and accessories available",
        "Branding and personalization options for corporate identity"
      ],
      "ownership_options": [
        "Purchase"
      ],
      "product_identifier": null,
      "pricing_information": "Pricing Available on Request",
      "applications_use_cases": [
        "Corporate branding and promotional campaigns",
        "Office supply distribution and employee gifts",
        "Trade show giveaways and client appreciation",
        "Business events and corporate meetings"
      ],
      "regulatory_information": [],
      "associate_certifications": [],
      "technical_specifications": {}
    }
  },
  {
    "name": "Custom Festival Accessories",
    "details": {
      "image_id": "refined-images/1774629804746129_ee5f8990ba1d4a1a93a3ed7097133ff4",
      "filter_data": {
        "Material Options": [
          "Plastic & Vinyl"
        ],
        "Primary Use Case": [
          "Trade Shows & Events",
          "Corporate Branding"
        ],
        "Product Category": [
          "Festival & Event",
          "Drinkware"
        ],
        "Application Setting": [
          "Festivals & Parades",
          "Corporate Events"
        ],
        "Customization Method": [
          "Screen Printing",
          "Full-Color Digital Print"
        ],
        "Sustainability Features": []
      },
      "product_key": "Custom Festival Accessories",
      "manufacturer": "Perfect Imprints",
      "product_name": "Custom Festival Accessories",
      "product_media": [
        {
          "url": "https://file-host.link/website/perfectimprints-od84er/assets/refined-images/1774629804746129_ee5f8990ba1d4a1a93a3ed7097133ff4/1080.webp"
        }
      ],
      "support_service": [
        "Custom design and imprinting services",
        "Email updates available for promotional offers",
        "Product selection assistance for festival and parade needs"
      ],
      "served_locations": [
        "USA"
      ],
      "shipping_returns": "Shipping and return information available upon request. Rush service available for select items.",
      "key_features_usps": [
        "Wide variety of customizable festival and parade accessories including beads, cups, and promotional items",
        "Perfect for Mardi Gras celebrations and parade throws with traditional purple, gold, and green color options",
        "Soft throw items like koozies that won't hurt crowd members when thrown from floats",
        "Custom logo printing available for business sponsors and Krewe branding",
        "Includes popular parade throws such as beads, plastic cups, candy, and stuffed animals"
      ],
      "ownership_options": [
        "Purchase"
      ],
      "product_identifier": null,
      "pricing_information": "Pricing varies by product. Stadium cups as low as $0.70. Medallion beads range from $1.30-$1.65. Chocolate coins from $0.59. Volume and custom pricing available upon request.",
      "applications_use_cases": [
        "Mardi Gras parades and celebrations in New Orleans, Mobile AL, Mississippi Gulf Coast, and other U.S. cities",
        "Festival promotional giveaways and parade throws for Krewe floats",
        "Business and sponsor branding during Mardi Gras season",
        "Tourist engagement and participant promotional items during festival celebrations",
        "Outdoor events, beach activities, and community celebrations"
      ],
      "regulatory_information": null,
      "associate_certifications": null,
      "technical_specifications": {
        "Customization": "Custom imprinting available",
        "Material Options": "Plastic, vinyl, silicone, fabric, paper",
        "Product Categories": "Stadium Cups, Flying Discs, Beverage Coolers, Stress Balls, Beach Balls, Temporary Tattoos, Lip Balm, Hand Sanitizers, Beads, Flags, Banners",
        "Minimum Order Quantities": "Varies by product (100-1000 units)"
      }
    }
  },
  {
    "name": "Custom Tech",
    "details": {
      "product_key": "Custom Tech Accessories",
      "manufacturer": null,
      "product_name": "Custom Tech",
      "support_service": null,
      "served_locations": null,
      "shipping_returns": null,
      "key_features_usps": [
        "Wide range of promotional tech products including power banks, Bluetooth speakers, and earbuds",
        "RFID blocking technology available for security-focused products",
        "Multiple USB flash drive capacity options from 1GB to 32GB",
        "Comprehensive cell phone accessories including cases, chargers, and waterproof pouches",
        "Tech bags and cases with laptop compartments and specialized storage solutions"
      ],
      "ownership_options": [
        "Purchase"
      ],
      "product_identifier": null,
      "pricing_information": "Pricing Available on Request",
      "applications_use_cases": [
        "Trade shows and promotional events",
        "Corporate gifts and employee recognition programs",
        "Marketing campaigns and brand awareness initiatives",
        "Tech accessories for business professionals and students",
        "Mobile device protection and charging solutions"
      ],
      "regulatory_information": null,
      "associate_certifications": null,
      "technical_specifications": {
        "Tech Accessories": "Tech Bags & Cases, Laptop/Tablet Sleeves, Laptop Backpacks, Messenger Bags, Phone Cases, Chargers, Phone Wallets, Phone Stands & Holders, Screen Cleaners, Waterproof Pouches",
        "Product Categories": "Power Banks, RFID Blockers, Bluetooth Speakers, Earbuds, Headphones, USB Flash Drives (1GB-32GB), Stylus Pens, Mouse Pads, Webcam Covers, Phone Accessories",
        "USB Flash Drive Capacities": "1GB, 2GB, 4GB, 8GB, 16GB, 32GB"
      }
    }
  },
  {
    "name": "Custom Outdoor & Sporting Promotional Products",
    "details": {
      "image_id": "refined-images/1774629802532160_51bd87f03aea4b28bce7a9668136296b",
      "filter_data": {
        "Material Options": [
          "Plastic & Vinyl"
        ],
        "Primary Use Case": [
          "Corporate Branding",
          "Trade Shows & Events",
          "Employee & Client Appreciation"
        ],
        "Product Category": [
          "Outdoor & Sporting",
          "Bags"
        ],
        "Application Setting": [
          "Camping & Outdoors",
          "Sports & Athletics",
          "Corporate Events"
        ],
        "Customization Method": [
          "Screen Printing",
          "Full-Color Digital Print"
        ],
        "Sustainability Features": []
      },
      "product_key": "Custom Outdoor",
      "manufacturer": "Perfect Imprints",
      "product_name": "Custom Outdoor & Sporting Promotional Products",
      "product_media": [
        {
          "url": "https://file-host.link/website/perfectimprints-od84er/assets/refined-images/1774629802532160_51bd87f03aea4b28bce7a9668136296b/1080.webp"
        }
      ],
      "support_service": [
        "Custom logo printing and decoration services",
        "Quote request available",
        "Sample ordering available",
        "Design and buy services"
      ],
      "served_locations": [
        "USA"
      ],
      "shipping_returns": "Lead time varies by product (5-7 days standard). Rush production available on select items. Return policies and warranty information available upon request.",
      "key_features_usps": [
        "Wide variety of outdoor promotional products including coolers, sunglasses, umbrellas, and sporting goods",
        "Custom water coolers perfect for camping, outdoor festivals, sporting events with logo printing capabilities",
        "Multiple cooler sizes and styles available with insulated options from trusted brands like Coleman and Igloo",
        "Comprehensive outdoor product line including beach items, BBQ accessories, flashlights, and camping gear",
        "Customizable promotional items ideal for outdoor adventures and sporting events"
      ],
      "ownership_options": [
        "Purchase"
      ],
      "product_identifier": null,
      "pricing_information": "Pricing Available on Request",
      "applications_use_cases": [
        "Camping and outdoor festivals",
        "Sporting events and athletic activities",
        "Beach outings and water activities",
        "Corporate events and promotional giveaways",
        "Outdoor recreation including hiking, fishing, golf, and other sports",
        "BBQ and picnic events"
      ],
      "regulatory_information": null,
      "associate_certifications": null,
      "technical_specifications": {
        "Cooler Types": "Soft-sided, Hard-sided, Foldable",
        "Brand Options": "Coleman, Igloo, Arctic Zone, Koozie, Hydro Flask, and others",
        "Special Features": "Some options include speakers and bottle openers",
        "Product Categories": "Coolers, Sunglasses, Folding Chairs, Umbrellas, Flying Discs, Fans, Sports Balls, Camping & Outdoor, Beach Items, BBQ Items, Flashlights",
        "Cooler Sizes Available": "1/3 gallon, 1/2 gallon, 1 gallon, 2 gallon, 5 gallon"
      }
    }
  }
]`,
  paaDataJson: `[
  "What are the 5 C's of event planning?"
]`,
};

const CLIENT_POWELL_SYSTEMS_INC: ClientSample = {
  id: `c5064237-0905-47fd-b49e-31162b70a119`,
  slug: `powell-systems-inc`,
  name: `Powell Systems Inc`,
  url: `http://www.powellsystems.com/`,
  primaryLogoUrl: `https://file-host.link/website/powellsystems-xkd83h/assets/logo/1768413645035531_ba4f40757a09467a9e5fcb947f312240.webp`,
  sampleServiceTopic: `Houston Container Customization Experts`,
  sampleCategoryTopic: `Steel Storage Containers for Industrial Material Handling`,
  sampleBlogTopic: `The Ultimate Guide to Corrugated Box Design`,
  designTokensJson: `{
  "fonts": {
    "body_font_url": "https://fonts.googleapis.com/css2?family=Inter:wght@300..700&display=swap",
    "heading_font_url": "https://fonts.googleapis.com/css2?family=Urbanist:wght@300..700&display=swap"
  },
  "css_variables": {
    "--color-brand-text": "#1a1a1a",
    "--font-family-body": "Inter, ui-sans-serif, system-ui, sans-serif",
    "--color-brand-primary": "#007DC5",
    "--font-family-heading": "Urbanist, ui-sans-serif, system-ui, sans-serif",
    "--color-brand-secondary": "#00B4D8",
    "--color-brand-text-muted": "#9ca3af",
    "--color-brand-primary-dark": "#005A8F",
    "--color-brand-text-inverse": "#ffffff",
    "--color-brand-text-primary": "#1a1a1a",
    "--color-brand-primary-hover": "#006AAA",
    "--color-brand-primary-light": "rgba(0, 125, 197, 0.05)",
    "--color-brand-text-tertiary": "#6b6b6b",
    "--color-brand-primary-medium": "rgba(0, 125, 197, 0.1)",
    "--color-brand-secondary-dark": "#007A9C",
    "--color-brand-text-secondary": "#4a4a4a",
    "--color-brand-secondary-hover": "#0096BA",
    "--color-brand-secondary-light": "rgba(0, 180, 216, 0.05)",
    "--color-brand-secondary-medium": "rgba(0, 180, 216, 0.1)",
    "--color-brand-primary-foreground": "#ffffff",
    "--color-brand-secondary-foreground": "#ffffff"
  }
}`,
  companyInfoJson: `{
  "name": {
    "dba_name": null,
    "legal_name": "Powell Systems Inc",
    "company_name": "Powell Systems"
  },
  "founded": {
    "founded_date_year": 1920,
    "years_in_business": "Over 100 years"
  },
  "locations": {
    "branch_locations": [],
    "headquarters_address": "604 E. 9th Street, P.O. Box 345, Fowler, IN 47944"
  },
  "credentials": {
    "memberships": [],
    "accreditations": [],
    "certifications": [],
    "business_licenses": []
  },
  "company_size": {
    "employee_count": null,
    "annual_turnover": null
  },
  "service_team": {
    "team_members": [],
    "employee_count": null,
    "years_of_experience": null
  },
  "company_story": {
    "milestones": [
      "1920: Founded by William J. Powell as Powell Pressed Steel in Hubbard, Ohio"
    ],
    "founding_story": "Founded by William J. Powell as Powell Pressed Steel in Hubbard, Ohio in 1920, PSI started with steel tote boxes used to move manufactured material from one work station to another. They pioneered several unique designs including gravity-feed and drop-bottom containers.",
    "company_history": "Powell Systems Inc. has been manufacturing material handling equipment for four generations. The company offers a comprehensive line of standard and custom corrugated steel containers and high-quality packaging systems.",
    "growth_narrative": "Starting with steel tote boxes, the company expanded to develop machinery that would automatically feed, weigh and package parts. They further evolved to produce stainless steel net weigh packaging systems for food products, with their packaging systems now capable of filling individual bags or boxes up to 55 pounds."
  },
  "phone_numbers": [
    "+1 765-884-0613",
    "765-884-0613"
  ],
  "service_areas": [
    "Nationwide"
  ],
  "email_addresses": [
    "info@powell-systems.com"
  ],
  "major_customers": [],
  "ratings_reviews": {
    "GBP": {
      "rating": null,
      "review_count": null
    }
  },
  "business_category": [
    "Steel fabricator"
  ],
  "target_geographies": [
    "us"
  ],
  "value_propositions": {
    "key_benefits": [
      "Efficient and safe movement of parts",
      "Improved packaging and shipping operations",
      "Labor and product savings"
    ],
    "market_positioning": "A leading manufacturer of steel containers, skids and pallets for materials handling, and automatic net weigh fillers for the fastener and IQF food industries.",
    "competitive_advantages": [
      "Over 100 years of experience",
      "Made in the USA steel containers and automated systems",
      "Four generations of manufacturing material handling equipment"
    ],
    "unique_selling_propositions": [
      "Custom-designed workstations",
      "Comprehensive line of standard and custom corrugated steel containers",
      "High-quality packaging systems"
    ]
  },
  "awards_recognitions": [],
  "social_media_profiles": {
    "other": [],
    "yelp_url": null,
    "twitter_url": null,
    "youtube_url": null,
    "facebook_url": "https://www.facebook.com/PowellSystemsInc",
    "linkedin_url": null,
    "whatsapp_url": null,
    "instagram_url": null
  },
  "target_customer_segments": [
    "Fasteners & Stampings",
    "Heavy Construction",
    "Forgings & Castings",
    "Rubber and Tire Industry",
    "Oil & Gas",
    "Recycling & Scrap",
    "Automotive & Heavy Truck",
    "Steel & Aluminum",
    "IQF Food Industries"
  ],
  "mission_statement_company_values": {
    "vision": null,
    "taglines": [
      "Time tested. Quality proven. 100 years of material handling solutions."
    ],
    "core_values": [],
    "mission_statement": null
  }
}`,
  additionalInfoJson: `{
  "business_profile": {
    "inventory_nature": "90% Whole Units / 10% Custom Solutions",
    "business_identity": "Industrial manufacturer of steel containers, material handling solutions, and automated packaging systems with over 100 years of experience serving manufacturing industries.",
    "primary_verticals": [
      "Steel Containers",
      "Feeders",
      "Weigh Fillers",
      "Integrated Systems",
      "Automated Packaging Solutions"
    ],
    "explicit_out_of_scope": [
      "Used Equipment",
      "Rental Services",
      "Residential/Home Goods",
      "Non-Industrial Applications"
    ]
  }
}`,
  logoUrlsJson: `{
  "favicon": "https://file-host.link/website/powellsystems-xkd83h/assets/logo/1768413645229747_0ef2a515591d4bab92dccace4309c841.webp",
  "primary_logo": "https://file-host.link/website/powellsystems-xkd83h/assets/logo/1768413645035531_ba4f40757a09467a9e5fcb947f312240.webp"
}`,
  serviceCatalogJson: `[
  {
    "name": "Automatic Jar and Cup Filling",
    "details": {
      "availability": "Not specified",
      "service_name": "Automatic Jar and Cup Filling",
      "pricing_offers": "[\\n    \\"The return on investment is typical within a year or less\\",\\n    \\"Financing options available for systems\\"\\n]",
      "service_description": "Powell Systems offers automated solutions for filling jars and cups with various products. This is part of their integrated systems that provide fast, accurate, and reliable packaging for food and consumer goods."
    }
  },
  {
    "name": "Steel Containers",
    "details": {
      "availability": "Not specified",
      "service_name": "Steel Containers",
      "pricing_offers": "[\\n    \\"Not specified\\"\\n]",
      "service_description": "Powell Systems Inc. manufactures a comprehensive line of standard and custom corrugated steel containers for various applications. Their steel container offerings include several types: Standard, Flowmatic, Smooth Sided, Drop Bottom, Roll-Over, Platform, Tapered Nose, and Hot N Heavy (The Brute). The Flowmatic container is a gravity-feed steel container ideal for handling in and out of process parts, with no protruding corners, channels or lugs, and formed offset stacking legs that permit stackability and four-way entry. The B3 'Smooth Sided' containers feature a contamination-free design, specifically heavy-duty units designed to minimize cross-contamination of fasteners and small stampings between containers. The Drop Bottom containers provide a fast, efficient, and safe way to move and place parts for assembly and other operations, with parts discharged through the bottom of the container and placed at the fingertips of operators using custom-designed workstations. These containers serve various industries including Fasteners & Stampings, Heavy Construction, Forgings & Castings, Rubber and Tire Industry, Oil & Gas, Recycling & Scrap, Automotive & Heavy Truck, and Steel & Aluminum."
    }
  },
  {
    "name": "Automatic Tray and Box Filling",
    "details": {
      "availability": "Not specified",
      "service_name": "Automatic Tray and Box Filling",
      "pricing_offers": "[\\n    \\"The return on investment is typical within a year or less\\",\\n    \\"Financing options available for systems\\"\\n]",
      "service_description": "Powell Systems provides automated solutions for filling trays and boxes with food and consumer goods in a fast, accurate, and reliable way. This service helps businesses control labor costs and product giveaway while meeting production goals and customer needs. The system can handle various products including frozen food, meat and poultry, fruit and produce, candy, baked goods, snacks, vitamins and gummies, coffee and other powders and grains, cannabis and more."
    }
  },
  {
    "name": "Custom Solutions",
    "details": {
      "availability": "Not specified",
      "service_name": "Custom Solutions",
      "pricing_offers": "[\\n    \\"Not specified\\"\\n]",
      "service_description": "Powell Systems offers custom solutions for unique requirements. As stated on their website, 'If it's mechanically possible, we will build a solution to suit your requirements.' They listen to each customer's unique product and packaging specifications and integrate weigh, fill, and conveyor solutions at a superior high quality and ultra-competitive price."
    }
  },
  {
    "name": "Feeders",
    "details": {
      "availability": "Not specified",
      "service_name": "Feeders",
      "pricing_offers": "[\\n    \\"Not specified\\"\\n]",
      "service_description": "Powell Systems offers specialty feeders that are fast, accurate, and efficient. Their fully automatic net weigh/count packaging systems are designed to improve the performance of almost any packaging and shipping operation. These feeders are part of their integrated systems solutions and feature Skako Vibration Feeders technology."
    }
  },
  {
    "name": "Automatic Re-Closable Pouch Filling",
    "details": {
      "availability": "Not specified",
      "service_name": "Automatic Re-Closable Pouch Filling",
      "pricing_offers": "[\\n    \\"The return on investment is typical within a year or less\\",\\n    \\"Financing options available for systems\\"\\n]",
      "service_description": "This service provides automated solutions for filling re-closable pouches with various products. It's part of Powell's integrated systems that help businesses scale quickly with high-quality packaging solutions."
    }
  },
  {
    "name": "Automatic Bag Filling",
    "details": {
      "availability": "Not specified",
      "service_name": "Automatic Bag Filling",
      "pricing_offers": "[\\n    \\"The return on investment is typical within a year or less\\",\\n    \\"Financing options available for systems\\"\\n]",
      "service_description": "Part of Powell's Integrated Systems solutions, the Automatic Bag Filling service provides automated packaging solutions for filling bags with various products including frozen food, meat and poultry, fruit and produce, candy, baked goods, snacks, vitamins and gummies, coffee and other powders and grains, cannabis and more. These systems are designed to control labor costs and product giveaway while meeting production goals and customer needs."
    }
  },
  {
    "name": "Weigh Fillers",
    "details": {
      "availability": "Not specified",
      "service_name": "Weigh Fillers",
      "pricing_offers": "[\\n    \\"Not specified\\"\\n]",
      "service_description": "Powell Systems provides weigh fillers including the AWC Series and ASA models. These weigh/count fillers feature Skako Vibration Feeders technology and are designed for precise weighing and filling operations in packaging systems."
    }
  }
]`,
  productInformationJson: `[
  {
    "name": "B3 Smooth Sided Steel Container",
    "details": {
      "image_id": "refined-images/1768415577012412_bc415403b0f24101ba3bfb3dd9edc4e5",
      "filter_data": {
        "Entry Type": [
          "4-Way Entry"
        ],
        "Steel Gauge": [
          "7 gauge",
          "10 gauge",
          "12 gauge",
          "14 gauge"
        ],
        "Capacity (lbs)": [
          "3000 lbs",
          "5000 lbs"
        ],
        "Container Type": [
          "Standard 4-Way Entry"
        ],
        "Construction Type": [
          "Smooth Sided"
        ],
        "Entry Configuration": [
          "4-way entry"
        ],
        "Container Design Type": [
          "Standard Storage"
        ],
        "Weight Capacity (lbs)": {
          "max": 5000,
          "min": 3000
        }
      },
      "product_key": "https://www.powellsystems.com/smooth-sided",
      "manufacturer": "Powell Systems Inc",
      "product_name": "B3 Smooth Sided Steel Container",
      "product_media": [
        {
          "url": "https://file-host.link/website/powellsystems-xkd83h/assets/refined-images/1768415577012412_bc415403b0f24101ba3bfb3dd9edc4e5/1080.webp"
        }
      ],
      "support_service": [
        "Custom Design Service",
        "Technical Consultation",
        "Custom Quote Service",
        "Email Support: info@powell-systems.com",
        "Phone Support: (765) 884-0613"
      ],
      "served_locations": [
        "USA"
      ],
      "shipping_returns": "Shipping and return details available upon request. Lead times vary based on availability, options, and order quantity.",
      "key_features_usps": [
        "Contamination Free Design: Eliminates popular hiding places for stray parts to minimize cross-contamination of fasteners and small stampings",
        "Heavy Gauge Smooth Sides and Bottoms designed for heavy-duty applications",
        "Continuous, Solid Welded Seams and Joints for durability and strength",
        "Radius Corners with Outturned Flange for improved handling and safety",
        "Custom sizes and configurations available to meet unique requirements"
      ],
      "ownership_options": [
        "Purchase"
      ],
      "product_identifier": "B-3S / B-3SL",
      "pricing_information": "Pricing Available on Request. Prices shown for unpainted and do not include steel surcharge. Based on availability and options. Large quantities subject to various lead times.",
      "applications_use_cases": [
        "Storage and transportation of fasteners",
        "Handling of small stampings and metal parts",
        "Industrial material handling in manufacturing facilities",
        "Preventing cross-contamination in multi-part production environments",
        "Heavy-duty parts storage and transport requiring contamination-free design"
      ],
      "regulatory_information": [],
      "associate_certifications": [],
      "technical_specifications": {
        "Finish": "Industrial Enamel Paint",
        "Material": "Heavy Gauge Steel",
        "Leg Design": "Capped Legs",
        "Construction": "Continuous, Solid Welded Seams and Joints",
        "Compatibility": "Inter-Stacks with Standard Small Flow-Matic / B-6s",
        "Corner Design": "Radius Corners with Outturned Flange",
        "Bottom Options": "Corrugated or Flat",
        "Model B-3S Volume": "11 cu ft",
        "Model B-3S Weight": "190 lbs",
        "Model B-3SL Volume": "20 cu ft",
        "Model B-3SL Weight": "272 lbs",
        "Model B-3S Capacity": "3000 lbs",
        "Model B-3SL Capacity": "5000 lbs",
        "Model B-3S Dimensions": "33\\" x 36\\" x 18\\"",
        "Model B-3SL Dimensions": "33\\" x 48\\" x 24\\""
      }
    }
  },
  {
    "name": "Hot & Heavy - The Brute - Steel Container corrugated bins, heavy duty corrugated boxes",
    "details": {
      "image_id": "refined-images/1768415218994988_18a8ba0a774d4cc3886eca4972a46848",
      "filter_data": {
        "Steel Gauge": [
          "7 gauge",
          "10 gauge",
          "12 gauge",
          "14 gauge"
        ],
        "Capacity (lbs)": [],
        "Container Type": [
          "Heavy-Duty"
        ],
        "Entry Configuration": [
          "2-way or 4-way entry",
          "2-way entry",
          "4-way entry"
        ],
        "Volume (cubic feet)": {
          "max": 22,
          "min": 11
        }
      },
      "product_key": "https://www.powellsystems.com/hot-n-heavy",
      "manufacturer": "Powell Systems Inc",
      "product_name": "Hot & Heavy - The Brute - Steel Container corrugated bins, heavy duty corrugated boxes",
      "product_media": [
        {
          "url": "https://file-host.link/website/powellsystems-xkd83h/assets/refined-images/1768415218994988_18a8ba0a774d4cc3886eca4972a46848/1080.webp"
        }
      ],
      "support_service": [
        "Custom design and engineering services available",
        "Technical Support via phone (765) 884-0613",
        "Custom quote service available online and via email at info@powell-systems.com",
        "Custom color matching services",
        "Special requirements and unique design consultation"
      ],
      "served_locations": [
        "USA"
      ],
      "shipping_returns": "Shipping and return details available upon request. Contact Powell Systems at info@powell-systems.com or (765) 884-0613 for specific delivery and warranty information.",
      "key_features_usps": [
        "Extra-heavy-duty construction designed for castings, forgings, stampings and other hot or heavy parts",
        "Higher stacking capability allows for greater floor space utilization with added safety",
        "Rugged steel container built to withstand extreme weight and temperature conditions",
        "Highly customizable design with options for corrugations, gates, dividers, and accessibility features",
        "Available in multiple standard colors with custom color matching available"
      ],
      "ownership_options": [
        "Purchase"
      ],
      "product_identifier": "Hot N Heavy - The Brute",
      "pricing_information": "Pricing Available on Request",
      "applications_use_cases": [
        "Material handling for castings and forgings in foundries",
        "Storage and transport of heavy stampings and metal components",
        "Handling hot parts in manufacturing environments",
        "Heavy-duty industrial material storage and transport",
        "Scrap handling with optional hinged bottom dump containers",
        "Automotive and heavy manufacturing parts management"
      ],
      "regulatory_information": [
        "Manufactured in USA (Fowler, Indiana)"
      ],
      "associate_certifications": [],
      "technical_specifications": {
        "Top_Flanges": "May be turned in or out",
        "Construction": "Extra-heavy-duty corrugated steel",
        "Customization": "Length and width customizable to user needs",
        "Entry_Options": "2-way or 4-way entry",
        "Height_Increments": "3 inch increments",
        "Underclearance_Range": "4 to 12 inches",
        "Material_Gauge_Options": "7 to 14 gauge steel",
        "Corrugation_Configuration": "May be turned in or out"
      }
    }
  },
  {
    "name": "Flowmatic\\u00ae Gravity-Feed Steel Container",
    "details": {
      "image_id": "refined-images/1768415577261953_1a1729dc96224e6c8c28106f10e247bd",
      "filter_data": {
        "Steel Gauge": [
          "7 gauge",
          "10 gauge",
          "12 gauge",
          "14 gauge"
        ],
        "Capacity (lbs)": [
          "4000 lbs",
          "5000 lbs"
        ],
        "Container Type": [
          "Gravity-Feed"
        ],
        "Entry Configuration": [
          "4-way entry"
        ],
        "Volume (cubic feet)": {
          "max": 20,
          "min": 11
        }
      },
      "product_key": "https://www.powellsystems.com/flowmatic",
      "manufacturer": "Powell Systems Inc",
      "product_name": "Flowmatic\\u00ae Gravity-Feed Steel Container",
      "product_media": [
        {
          "url": "https://file-host.link/website/powellsystems-xkd83h/assets/refined-images/1768415577261953_1a1729dc96224e6c8c28106f10e247bd/1080.webp"
        }
      ],
      "support_service": [
        "Custom design services for special requirements",
        "Technical support via phone: (765) 884-0613",
        "Email support: info@powell-systems.com",
        "Quote request service available online"
      ],
      "served_locations": [
        "USA"
      ],
      "shipping_returns": "Lead times vary based on availability, options, and order quantities. Shipping and return details available upon request.",
      "key_features_usps": [
        "Gravity-feed design ideal for in-process and out-of-process parts handling",
        "No protruding corners, channels, or lugs for easy lift truck handling",
        "Formed offset stacking legs permit stackability with four-way forklift entry",
        "Continuous solid welded seams and joints with capped legs minimize cross-contamination",
        "Compatible with matching workstands featuring generous box holding areas for quick container spotting"
      ],
      "ownership_options": [
        "Purchase"
      ],
      "product_identifier": "FM-250-S, FM-250-L",
      "pricing_information": "Pricing available on request (Call for quote). Prices shown for unpainted units. Steel surcharge of $0.45 per lb applies as of May 1, 2021. Pricing varies based on availability, options, and quantities.",
      "applications_use_cases": [
        "Fastener manufacturing and production systems",
        "In-process parts handling and storage",
        "Out-of-process parts handling and storage",
        "Manufacturing facilities requiring quality control container systems",
        "Industrial material handling operations requiring gravity-feed containers"
      ],
      "regulatory_information": [],
      "associate_certifications": [],
      "technical_specifications": {
        "Material": "Corrugated steel (7 to 14 gauge options)",
        "Entry Type": "Four-way entry",
        "Design Type": "Gravity-feed with formed offset stacking legs",
        "Underclearance": "4 to 12 inches (variable)",
        "Height Increments": "3 inch increments (variable)",
        "Model FM-250-L Volume": "20 cubic feet",
        "Model FM-250-L Weight": "272 lbs",
        "Model FM-250-S Volume": "11 cubic feet",
        "Model FM-250-S Weight": "190 lbs",
        "Model FM-250-L Capacity": "5000 lbs",
        "Model FM-250-S Capacity": "4000 lbs",
        "Model FM-250-L (B-6L) Dimensions": "33 x 48 x 24 inches",
        "Model FM-250-S (B-6S) Dimensions": "33 x 36 x 18 inches"
      }
    }
  },
  {
    "name": "Standard 4 Way Entry Steel Container, stackable storage containers and boxes",
    "details": {
      "image_id": "refined-images/1768415578198456_e1d4cbd5cd4d4be098470093be6823cb",
      "filter_data": {
        "Steel Gauge": [
          "7 gauge",
          "10 gauge",
          "12 gauge",
          "14 gauge"
        ],
        "Capacity (lbs)": [
          "4000 lbs"
        ],
        "Container Type": [
          "Standard 4-Way Entry"
        ],
        "Entry Configuration": [
          "4-way entry"
        ],
        "Volume (cubic feet)": {
          "max": 22,
          "min": 16
        }
      },
      "product_key": "https://www.powellsystems.com/standard",
      "manufacturer": "Powell Systems Inc",
      "product_name": "Standard 4 Way Entry Steel Container, stackable storage containers and boxes",
      "product_media": [
        {
          "url": "https://file-host.link/website/powellsystems-xkd83h/assets/refined-images/1768415578198456_e1d4cbd5cd4d4be098470093be6823cb/1080.webp"
        }
      ],
      "support_service": [
        "Custom engineering and design services",
        "Technical consultation for special requirements",
        "Quick ship program available for select models",
        "Email support: info@powell-systems.com",
        "Phone support: (765) 884-0613"
      ],
      "served_locations": [
        "USA"
      ],
      "shipping_returns": "Lead times vary based on availability, options selected, and order quantities. Quick ship options available for select models. Contact manufacturer for specific delivery timeframes.",
      "key_features_usps": [
        "Four-way fork truck entry for maximum efficiency and versatility",
        "Formed offset stacking legs for stable storage",
        "Available in standard and custom sizes with various configuration options",
        "Choice of in-turned or out-turned corrugations (B-3 and 200-FL models)",
        "Optional features including riveted crane lugs, gates, doors, dividers, and oil-tight designs"
      ],
      "ownership_options": [
        "Purchase"
      ],
      "product_identifier": "B-3S / B-3L / 200-FL",
      "pricing_information": "Prices shown for unpainted units. B-3S (32x40x24): Call for pricing. B-3L (36x48x24): Call for pricing. Steel surcharge of 45 cents per lb applies as of May 1, 2021. Custom pricing available upon request.",
      "applications_use_cases": [
        "Industrial material handling and storage",
        "Manufacturing facility part containment and transport",
        "Warehouse inventory organization",
        "Heavy-duty parts storage requiring forklift accessibility",
        "Scrap handling with optional hinged bottom dump configurations",
        "Custom industrial applications requiring specialized container design"
      ],
      "regulatory_information": [],
      "associate_certifications": [],
      "technical_specifications": {
        "Material": "Corrugated steel (7 to 14 gauge)",
        "Entry Type": "4-way fork truck entry",
        "B-3L Volume": "22 cu ft",
        "B-3L Weight": "225 lbs",
        "B-3S Volume": "16 cu ft",
        "B-3S Weight": "170 lbs",
        "B-3L Capacity": "4000 lbs",
        "B-3S Capacity": "4000 lbs",
        "B-3L Dimensions": "36 x 48 x 24 inches",
        "B-3S Dimensions": "32 x 40 x 24 inches",
        "Stacking Design": "Formed offset stacking legs",
        "Corrugation Types": "In-turned or out-turned",
        "Height Increments": "3 inch increments (custom)",
        "B-3 Model Corrugations": "Out-turned",
        "Underclearance Options": "4 to 12 inches",
        "200-FL Model Corrugations": "In-turned"
      }
    }
  },
  {
    "name": "Tapered Nose Boxes and corrugated bins for warehouse",
    "details": {
      "image_id": "refined-images/1768415574089088_6a9638035f2d4c2abf57640d4aea6953",
      "filter_data": {
        "Steel Gauge": [
          "7 gauge",
          "10 gauge",
          "12 gauge",
          "14 gauge"
        ],
        "Capacity (lbs)": [],
        "Container Type": [
          "Tapered Nose"
        ],
        "Entry Configuration": [
          "2-way or 4-way entry",
          "2-way entry",
          "4-way entry"
        ],
        "Volume (cubic feet)": {
          "max": 22,
          "min": 11
        }
      },
      "product_key": "https://www.powellsystems.com/tapered-nose-boxes",
      "manufacturer": "Powell Systems Inc",
      "product_name": "Tapered Nose Boxes and corrugated bins for warehouse",
      "product_media": [
        {
          "url": "https://file-host.link/website/powellsystems-xkd83h/assets/refined-images/1768415574089088_6a9638035f2d4c2abf57640d4aea6953/1080.webp"
        }
      ],
      "support_service": [
        "Custom design and engineering services",
        "Technical consultation via phone (765) 884-0613",
        "Email support at info@powell-systems.com",
        "Custom quote request service"
      ],
      "served_locations": [
        "USA"
      ],
      "shipping_returns": "Shipping and return information not specified. Contact manufacturer for details.",
      "key_features_usps": [
        "Open-end, tapered-nose design provides easy access to contents",
        "Easily stacked and can be handled by lift truck, crane or monorail",
        "Wide range of material handling applications including machine operators and order picking",
        "Customizable design with flexible dimensions and configurations",
        "Available in multiple standard colors with custom color matching available"
      ],
      "ownership_options": [
        "Purchase"
      ],
      "product_identifier": "Tapered Nose Boxes",
      "pricing_information": "Pricing Available on Request",
      "applications_use_cases": [
        "Material handling in manufacturing environments",
        "Machine operator accessibility",
        "Order picking operations",
        "Parts storage and transportation",
        "Production floor material containment",
        "Scrap handling with optional hinged bottom dump configuration"
      ],
      "regulatory_information": [],
      "associate_certifications": [],
      "technical_specifications": {
        "Material": "Corrugated Steel",
        "Top Flanges": "Can be turned in or out",
        "Customization": "Length and width vary according to user needs",
        "Entry Options": "2-way or 4-way entry",
        "Gauge Options": "7 to 14 gauge",
        "Underclearance": "4 to 12 inches",
        "Height Increments": "3 inch increments",
        "Corrugation Configuration": "Can be turned in or out"
      }
    }
  },
  {
    "name": "Roll Over Boxes (Steel Container)",
    "details": {
      "image_id": "refined-images/1768415574437404_95605e8e5eed40d1a4e9568990f5bc64",
      "filter_data": {
        "Entry Type": [
          "2-Way Entry",
          "4-Way Entry"
        ],
        "Steel Gauge": [
          "7 gauge",
          "10 gauge",
          "12 gauge",
          "14 gauge"
        ],
        "Capacity (lbs)": [
          "4000 lbs",
          "6000 lbs"
        ],
        "Container Type": [
          "Roll Over"
        ],
        "Construction Type": [
          "Corrugated Steel"
        ],
        "Entry Configuration": [
          "2-way entry",
          "4-way entry"
        ],
        "Container Design Type": [
          "Roll Over"
        ],
        "Weight Capacity (lbs)": {
          "max": 6000,
          "min": 4000
        }
      },
      "product_key": "https://www.powellsystems.com/roll-over",
      "manufacturer": "Powell Systems Inc",
      "product_name": "Roll Over Boxes (Steel Container)",
      "product_media": [
        {
          "url": "https://file-host.link/website/powellsystems-xkd83h/assets/refined-images/1768415574437404_95605e8e5eed40d1a4e9568990f5bc64/1080.webp"
        }
      ],
      "support_service": [
        "Custom design services available",
        "Technical consultation via phone (765) 884-0613",
        "Email support at info@powell-systems.com",
        "Quote request service available online"
      ],
      "served_locations": [
        "USA"
      ],
      "shipping_returns": "Shipping and return information not specified. Contact manufacturer for details at (765) 884-0613 or info@powell-systems.com.",
      "key_features_usps": [
        "Designed for high-volume operations where quick emptying is desired",
        "Rugged formed channel understructure that assures positive fork handling and maximum wear",
        "Compatible with rotary head lift truck attachments",
        "Wide variety of configurations and stacking options available",
        "Custom designs available including four-way accessibility and specialized gate configurations"
      ],
      "ownership_options": [
        "Purchase"
      ],
      "product_identifier": "Roll Over Box",
      "pricing_information": "Pricing Available on Request",
      "applications_use_cases": [
        "High-volume manufacturing operations",
        "Material handling requiring quick container emptying",
        "Industrial environments using forklift and rotary head lift truck attachments",
        "Parts handling and transportation",
        "Scrap handling operations"
      ],
      "regulatory_information": [],
      "associate_certifications": [],
      "technical_specifications": {
        "Material": "Corrugated steel",
        "Fork Entry": "2-way or 4-way entry options",
        "Top Flanges": "Can be turned in or out",
        "Compatibility": "Designed for use with rotary head lift truck attachments",
        "Gauge Options": "7 to 14 gauge steel",
        "Underclearance": "4 to 12 inches",
        "Understructure": "Rugged formed channel understructure",
        "Height Increments": "3 inch increments",
        "Corrugation Options": "Can be turned in or out"
      }
    }
  },
  {
    "name": "Platform heavy duty corrugated boxes",
    "details": {
      "image_id": "refined-images/1768415573562554_ff799bd2356041ce980cb58009a5919b",
      "filter_data": {
        "Steel Gauge": [
          "7 gauge",
          "10 gauge",
          "12 gauge",
          "14 gauge"
        ],
        "Capacity (lbs)": [],
        "Container Type": [
          "Platform Box"
        ],
        "Entry Configuration": [
          "2-way or 4-way entry",
          "2-way entry",
          "4-way entry"
        ],
        "Volume (cubic feet)": {
          "max": 22,
          "min": 11
        }
      },
      "product_key": "https://www.powellsystems.com/platform-boxes",
      "manufacturer": "Powell Systems Inc",
      "product_name": "Platform heavy duty corrugated boxes",
      "product_media": [
        {
          "url": "https://file-host.link/website/powellsystems-xkd83h/assets/refined-images/1768415573562554_ff799bd2356041ce980cb58009a5919b/1080.webp"
        }
      ],
      "support_service": [
        "Custom design and engineering services",
        "Technical consultation available",
        "Quote request service",
        "Email support: info@powell-systems.com",
        "Phone support: (765) 884-0613"
      ],
      "served_locations": [
        "USA"
      ],
      "shipping_returns": "Shipping and return information available upon request. Contact manufacturer for specific details.",
      "key_features_usps": [
        "Welded box platforms available in variety of sizes and weight capacities",
        "Customizable options including riveted crane lugs, stacking brackets, and four-way lift truck entry",
        "Corrugated steel construction with flexible design options",
        "Oil-tight designs available",
        "Multiple color options with custom color matching available"
      ],
      "ownership_options": [
        "Purchase"
      ],
      "product_identifier": "Platform Boxes",
      "pricing_information": "Pricing Available on Request",
      "applications_use_cases": [
        "Material handling and storage",
        "Industrial parts transportation",
        "Manufacturing facility logistics",
        "Scrap handling with hinged bottom dump option",
        "Gravity discharge applications"
      ],
      "regulatory_information": [],
      "associate_certifications": [],
      "technical_specifications": {
        "Material": "Corrugated Steel",
        "Dimensions": "Variable length and width according to customer needs",
        "Top Flanges": "In or Out",
        "Forklift Entry": "2-way or 4-way entry",
        "Underclearance": "4 to 12 inches",
        "Height Increments": "3 inches",
        "Steel Gauge Options": "7 to 14 gauge",
        "Corrugation Orientation": "In or Out"
      }
    }
  },
  {
    "name": "Drop Bottom Steel Container",
    "details": {
      "image_id": "refined-images/1768415576022502_355fe8f7adc64474a4689d870b6b99d5",
      "filter_data": {
        "Steel Gauge": [
          "7 gauge",
          "10 gauge",
          "12 gauge",
          "14 gauge"
        ],
        "Capacity (lbs)": [
          "6000 lbs"
        ],
        "Container Type": [
          "Drop Bottom"
        ],
        "Entry Configuration": [
          "2-way or 4-way entry",
          "2-way entry",
          "4-way entry"
        ],
        "Volume (cubic feet)": {
          "max": 20,
          "min": 20
        }
      },
      "product_key": "https://www.powellsystems.com/drop-bottom",
      "manufacturer": "Powell Systems Inc",
      "product_name": "Drop Bottom Steel Container",
      "product_media": [
        {
          "url": "https://file-host.link/website/powellsystems-xkd83h/assets/refined-images/1768415576022502_355fe8f7adc64474a4689d870b6b99d5/1080.webp"
        }
      ],
      "support_service": [
        "Custom design and engineering services",
        "Technical consultation available",
        "Quote request service",
        "Phone support: (765) 884-0613",
        "Email support: info@powell-systems.com"
      ],
      "served_locations": [
        "USA"
      ],
      "shipping_returns": "Delivery times vary based on availability, options, and large quantities. Specific shipping and return policies available upon request. Contact manufacturer for details.",
      "key_features_usps": [
        "Fast, efficient, and safe way to move and place parts for assembly operations",
        "Parts discharged through the bottom of container and placed at operator's fingertips",
        "Compatible with lift truck mast attachment for easy discharge without a stand",
        "Corrugations available in-turned or out-turned with reinforced seams",
        "Highly customizable design with extensive options for dimensions, colors, and configurations"
      ],
      "ownership_options": [
        "Purchase"
      ],
      "product_identifier": "315-L (D-1L)",
      "pricing_information": "Pricing available upon request. Listed as 'Call' for unpainted units. Steel surcharge applicable (45 cents per lb as of May 1, 2021). Pricing varies based on availability, options, and quantity.",
      "applications_use_cases": [
        "Assembly line parts handling and placement",
        "Manufacturing operations requiring efficient parts discharge",
        "Custom workstation integration for parts delivery",
        "Material handling in industrial facilities",
        "Scrap handling with hinged bottom dump configurations"
      ],
      "regulatory_information": [],
      "associate_certifications": [],
      "technical_specifications": {
        "Volume": "20 cubic feet",
        "Weight": "340 lbs",
        "Capacity": "6000 lbs",
        "Material": "Corrugated Steel",
        "Dimensions": "33 x 48 x 24 inches",
        "Model Number": "315-L (D-1L)",
        "Entry Options": "2-way or 4-way",
        "Gauge Options": "7 to 14 gauge",
        "Underclearance": "4 to 12 inches",
        "Height Increments": "3 inch variations"
      }
    }
  }
]`,
  paaDataJson: `[
  "How much is a 40 ft container to buy?",
  "How much does a 20 ft shipping container cost to buy?"
]`,
};

const CLIENT_ROSSINI_EQUIPMENT_CORP: ClientSample = {
  id: `7cae835c-faba-45de-abea-4e570509058a`,
  slug: `rossini-equipment-corp`,
  name: `Rossini Equipment Corp`,
  url: `https://rossiniequipmentcorp.com/`,
  primaryLogoUrl: `https://file-host.link/website/rossiniequipmentcorp-ke4ofc/assets/logo/logo.webp`,
  sampleServiceTopic: `Heavy Construction Equipment Rental in Grahamsville NY | Sullivan County`,
  sampleCategoryTopic: `Backhoe Rental with Operator Services`,
  sampleBlogTopic: `Do Excavators Hold Their Value? A Guide for Buyers`,
  designTokensJson: `{
  "fonts": {
    "body_font_url": "https://fonts.googleapis.com/css2?family=Inter:wght@300..700&display=swap",
    "heading_font_url": "https://fonts.googleapis.com/css2?family=Urbanist:wght@300..700&display=swap"
  },
  "css_variables": {
    "--color-brand-text": "#1A1A1A",
    "--font-family-body": "Inter, ui-sans-serif, system-ui, sans-serif",
    "--color-brand-primary": "#FFD700",
    "--font-family-heading": "Urbanist, ui-sans-serif, system-ui, sans-serif",
    "--color-brand-secondary": "#1A1A1A",
    "--color-brand-text-muted": "#6B6B6B",
    "--color-brand-primary-dark": "#B89A00",
    "--color-brand-text-inverse": "#ffffff",
    "--color-brand-text-primary": "#0D0D0D",
    "--color-brand-primary-hover": "#E6C200",
    "--color-brand-primary-light": "rgba(255, 215, 0, 0.05)",
    "--color-brand-text-tertiary": "#4A4A4A",
    "--color-brand-primary-medium": "rgba(255, 215, 0, 0.1)",
    "--color-brand-secondary-dark": "#000000",
    "--color-brand-text-secondary": "#2E2E2E",
    "--color-brand-secondary-hover": "#2E2E2E",
    "--color-brand-secondary-light": "rgba(26, 26, 26, 0.05)",
    "--color-brand-secondary-medium": "rgba(26, 26, 26, 0.1)",
    "--color-brand-primary-foreground": "#0D0D0D",
    "--color-brand-secondary-foreground": "#FFD700"
  }
}`,
  companyInfoJson: `{
  "name": {
    "dba_name": null,
    "legal_name": "Rossini Equipment Corp.",
    "company_name": "Rossini Equipment Corp"
  },
  "founded": {
    "founded_date_year": 1998,
    "years_in_business": "Over 25 years"
  },
  "locations": {
    "branch_locations": [],
    "headquarters_address": "7 St John St Ste 202, Monticello NY 12701"
  },
  "credentials": {
    "memberships": [],
    "accreditations": [],
    "certifications": [],
    "business_licenses": []
  },
  "company_size": {
    "employee_count": null,
    "annual_turnover": null
  },
  "service_team": {
    "team_members": [
      {
        "bio": "With decades in the field and a family legacy in construction going back to 1963, Joseph Rossini has built Rossini Equipment Corp. on real jobsite experience. From the company's base in Monticello, he delivers reliable equipment, skilled operators, and the kind of service only years in the industry can teach.",
        "name": "Joseph Rossini",
        "title": "Founder",
        "headshot_image": null
      }
    ],
    "employee_count": null,
    "years_of_experience": null
  },
  "company_story": {
    "milestones": [
      "1963: Rossini family business begins in New York construction industry",
      "1998: Rossini Equipment Corp. founded as subsidiary of Rossini Contractors",
      "Expanded yard and offices established in Monticello, NY"
    ],
    "founding_story": "With a lifetime of experience in excavation and heavy equipment, Joseph Rossini founded Rossini Equipment Corp. in 1998, focusing on what he knows best — putting well-maintained machines and decades of field knowledge to work for contractors, landscapers, and property owners.",
    "company_history": "Rossini Equipment Corp. was founded in 1998 as a subsidiary of Rossini Contractors, a family business with deep roots in the New York construction industry going back to 1963. For over three decades, the company built its reputation serving public agencies, utility companies, and private contractors across the New York metro area, delivering reliable, high-performance equipment solutions on some of the region's most demanding job sites.",
    "growth_narrative": "From serving the New York metro area for over three decades, Rossini Equipment Corp. has evolved to operate from an expanded yard and offices in Monticello, NY, where the company continues to deliver responsive service and technical expertise to Sullivan County and the surrounding Hudson Valley region."
  },
  "phone_numbers": [
    "(845) 794-1066"
  ],
  "service_areas": [
    "Sullivan County, NY",
    "Monticello",
    "Liberty",
    "Wurtsboro",
    "Rock Hill",
    "Fallsburg",
    "Bloomingburg",
    "Livingston Manor",
    "Middletown",
    "Orange County, NY",
    "Goshen",
    "Port Jervis",
    "Wallkill",
    "Warwick",
    "Florida",
    "Monroe",
    "Chester",
    "Hudson Valley"
  ],
  "email_addresses": [
    "office@rossiniequipmentcorp.com",
    "rossiniequipmentcorp@gmail.com"
  ],
  "major_customers": [
    {
      "customer_name": "Port Authority of New York and New Jersey",
      "customer_logo_url": null
    },
    {
      "customer_name": "NYC Department of Transportation",
      "customer_logo_url": null
    },
    {
      "customer_name": "NYC Parks Department",
      "customer_logo_url": null
    },
    {
      "customer_name": "Con Edison",
      "customer_logo_url": null
    }
  ],
  "value_propositions": {
    "key_benefits": [
      "Reliable, high-performance equipment solutions",
      "Responsive service and technical expertise",
      "Equipment arrives on time and ready to work",
      "Minimized coordination headaches",
      "Projects kept on schedule and within budget",
      "Strong safety record"
    ],
    "market_positioning": "Sullivan County's trusted source for heavy equipment rentals, excavation services, and site work, backed by over 60 years of construction industry experience and a commitment to reliable, professional service.",
    "competitive_advantages": [
      "Family business with deep roots in the New York construction industry",
      "Expanded yard and offices in Monticello, NY",
      "Well-maintained machines and decades of field knowledge",
      "Flexible daily, weekly, and monthly rental rates",
      "Equipment can be rented with or without an operator",
      "On-site servicing to minimize downtime on active job sites",
      "Secure short- and long-term parking for commercial vehicles and heavy equipment"
    ],
    "unique_selling_propositions": [
      "Founded as a subsidiary of Rossini Contractors with roots in construction going back to 1963",
      "Over 60 years of combined industry knowledge",
      "Operators bring decades of field experience across excavation, grading, demolition, and site preparation",
      "In-house transportation team handles delivery and pickup directly"
    ]
  },
  "awards_recognitions": [],
  "social_media_profiles": {
    "other": [],
    "yelp_url": null,
    "twitter_url": null,
    "youtube_url": null,
    "facebook_url": null,
    "linkedin_url": null,
    "whatsapp_url": null,
    "instagram_url": null
  },
  "target_customer_segments": [
    "Contractors",
    "Landscapers",
    "Property owners",
    "Public agencies",
    "Utility companies",
    "Private contractors",
    "Builders",
    "Developers",
    "Commercial property owners",
    "Industrial property owners",
    "Municipalities",
    "Local agencies",
    "General contractors",
    "Subcontractors",
    "Home builders"
  ],
  "mission_statement_company_values": {
    "vision": null,
    "taglines": [
      "Heavy Equipment Rentals Built on Real Jobsite Experience"
    ],
    "core_values": [],
    "mission_statement": null
  }
}`,
  additionalInfoJson: `{
  "business_profile": {
    "inventory_nature": "90% Whole Units (Heavy Equipment for Rent/Sale) / 10% Attachments & Accessories. Includes both new and used equipment, with explicit 'as-is' designations for older machinery.",
    "business_identity": "Heavy construction equipment provider offering rentals, sales, and operator hire services, with additional excavation contracting and equipment transportation capabilities in Sullivan County, NY.",
    "primary_verticals": [
      "Excavators",
      "Skid Steers/Track Loaders",
      "Attachments (Breakers, Chippers, Brooms, Buckets)",
      "Air Compressors & Generators",
      "Excavation & Site Work Contracting"
    ],
    "explicit_out_of_scope": [
      "Replacement Parts (individual components like hydraulic hoses, filters, engine parts)",
      "Consumables (fuel, oil, lubricants, maintenance supplies)",
      "Light/Residential Equipment (lawn mowers, small generators under 30A)",
      "Automotive/Truck Parts",
      "Building Materials (except flagstone and street plates which are sold)",
      "Hand Tools & Small Power Tools",
      "Manufacturing/OEM Production Services"
    ]
  }
}`,
  logoUrlsJson: `{
  "favicon": "https://file-host.link/website/rossiniequipmentcorp-ke4ofc/assets/logo/1774985033918776_e0641a84e5fe4647b1918a1fe00bbd53.png",
  "primary_logo": "https://file-host.link/website/rossiniequipmentcorp-ke4ofc/assets/logo/logo.webp"
}`,
  serviceCatalogJson: `[
  {
    "name": "Site Work Contracting",
    "details": {
      "availability": "Not specified",
      "service_name": "Site Work Contracting",
      "pricing_offers": "[\\n    \\"Not specified\\"\\n]",
      "service_description": "Excavation, building demolition, tank removals, and site preparation services. Specialized site work including blasting, drilling, rock breaking, and ground preparation executed with precision and in full compliance with all applicable safety and environmental standards. The company performs these services for complex, high-stakes job sites, working closely with clients to keep projects on schedule and within budget from initial mobilization through final completion."
    }
  },
  {
    "name": "Equipment Sales",
    "details": {
      "availability": "Not specified",
      "service_name": "Equipment Sales",
      "pricing_offers": "[\\n    \\"Not specified\\"\\n]",
      "service_description": "Sale of heavy construction and landscaping equipment including excavators, skid steers, track loaders, air compressors, generators, and various attachments. Equipment available for purchase is well-maintained and serviced to high standards."
    }
  },
  {
    "name": "Hauling and Removal",
    "details": {
      "availability": "Not specified",
      "service_name": "Hauling and Removal",
      "pricing_offers": "[\\n    \\"Not specified\\"\\n]",
      "service_description": "Reliable hauling of rock, earth, landscaping materials, and aggregate, plus efficient removal and responsible disposal. The service handles sorting and hauling debris to appropriate facilities, keeping job sites clean and safe throughout projects, and minimizing disturbance to surrounding areas."
    }
  },
  {
    "name": "Rock and Concrete Breaking",
    "details": {
      "availability": "Not specified",
      "service_name": "Rock and Concrete Breaking",
      "pricing_offers": "[\\n    \\"Not specified\\"\\n]",
      "service_description": "Expert services for breaking and removing rock, concrete slabs, foundations, and other reinforced concrete structures. Services include breaking and removing concrete slabs and pads, rock breaking for foundations and utility trenches, demolition of old footings, walls, and structures, removal of reinforced concrete and embedded steel, and hard rock excavation for site development. The service provides precision, power, and safe structural removal with controlled breaking and minimal vibration transfer. Services are available throughout Sullivan County, NY (including Monticello, Liberty, Rock Hill, Wurtsboro, Bloomingburg, Livingston Manor, Fallsburg) and Middletown & Orange County, NY (including Middletown, Goshen, Port Jervis, Monroe, Wallkill, Warwick, Florida, Chester)."
    }
  },
  {
    "name": "Excavation",
    "details": {
      "availability": "Not specified",
      "service_name": "Excavation",
      "pricing_offers": "[\\n    \\"Not specified\\"\\n]",
      "service_description": "Professional excavation services for foundations, site grading, trenching, and other earth-moving needs with modern equipment. Services are provided throughout Sullivan County, NY, Middletown, and the greater Orange County region. The company offers excavation for various construction and site development projects, utilizing experienced operators and well-maintained heavy equipment."
    }
  },
  {
    "name": "Tank Removal Service",
    "details": {
      "availability": "Not specified",
      "service_name": "Tank Removal Service",
      "pricing_offers": "[\\n    \\"Not specified\\"\\n]",
      "service_description": "Safe and efficient removal of above-ground and underground tanks, including site cleanup and compliant disposal of all materials. This service ensures proper handling and disposal of tank materials in accordance with safety and environmental standards."
    }
  },
  {
    "name": "Site Clearing",
    "details": {
      "availability": "Not specified",
      "service_name": "Site Clearing",
      "pricing_offers": "[\\n    \\"Not specified\\"\\n]",
      "service_description": "Land clearing services, including tree and stump removal, brush clearing, and hauling. Comprehensive site clearing services for residential, commercial, and land development projects throughout Sullivan County, NY, Middletown, and the greater Orange County region. Services include tree and shrub removal, stump removal and grinding prep, brush and vegetation clearing, debris hauling and disposal, clearing for driveways, lots, and building pads, and selective clearing for property access. The service covers removal of small and medium-size trees, cutting and safe handling of fallen or problematic trees, stump extraction and cleanup of root systems, thick brush and overgrowth removal, underbrush thinning, clearing of invasive vegetation, and preparing land for surveying or staging. Available in Sullivan County, NY (including Monticello, Liberty, Wurtsboro, Rock Hill, Fallsburg, Bloomingburg, Livingston Manor) and Middletown & Orange County, NY (including Middletown, Goshen, Port Jervis, Wallkill, Warwick, Florida, Monroe, Chester)."
    }
  },
  {
    "name": "Transportation",
    "details": {
      "availability": "Not specified",
      "service_name": "Transportation",
      "pricing_offers": "[\\n    \\"Not specified\\"\\n]",
      "service_description": "Reliable heavy equipment transportation services, ensuring timely delivery to and from your construction or excavation site. The service provides reliable solutions for moving heavy equipment and materials, with in-house transportation team handling delivery and pickup directly to minimize coordination issues. Available throughout Sullivan County and Middletown/Orange County region."
    }
  },
  {
    "name": "Maintenance",
    "details": {
      "availability": "Not specified",
      "service_name": "Maintenance",
      "pricing_offers": "[\\n    \\"Not specified\\"\\n]",
      "service_description": "Expert servicing and preventative maintenance to help optimize performance and extend equipment lifespan. The company provides on-site servicing to minimize downtime on active job sites, ensuring equipment reliability and optimal performance."
    }
  },
  {
    "name": "Full Hire Services",
    "details": {
      "availability": "Not specified",
      "service_name": "Full Hire Services",
      "pricing_offers": "[\\n    \\"Not specified\\"\\n]",
      "service_description": "Supplying both heavy equipment and experienced operators to keep excavation and construction projects running smoothly and on schedule. Full hire services provide both the right equipment and an experienced operator to run it, reducing downtime, improving jobsite safety, and ensuring work is completed correctly the first time. Services include excavation and earth-moving, site grading and site preparation, rock and concrete breaking support, hauling and material handling, and site clearing and cleanup. The service is ideal for contractors needing extra capacity or property owners who don't operate equipment. Available for short-term, project-based, or ongoing site support throughout Sullivan County, NY (including Monticello, Liberty, Wurtsboro, Rock Hill, Fallsburg, Bloomingburg, Livingston Manor) and Middletown & Orange County, NY (including Middletown, Goshen, Port Jervis, Wallkill, Warwick, Florida, Monroe, Chester)."
    }
  }
]`,
  productInformationJson: `[
  {
    "name": "Mini Skid Steer",
    "details": {
      "image_id": "refined-images/1775483283813990_5f9c1eff7c4b455b9d0e1c7e48ab6c1a",
      "filter_data": {
        "Size Class": [
          "Mini / Compact"
        ],
        "Equipment Type": [
          "Mini Skid Steer"
        ],
        "Primary Application": [
          "Material Handling & Loading",
          "Landscaping & Grading",
          "Debris Cleanup & Site Clearing"
        ],
        "Attachment Configuration": [
          "Multi-Attachment Compatible"
        ]
      },
      "product_key": "Mini skid steer",
      "manufacturer": null,
      "product_name": "Mini Skid Steer",
      "product_media": [
        {
          "url": "https://file-host.link/website/rossiniequipmentcorp-ke4ofc/assets/refined-images/1775483283813990_5f9c1eff7c4b455b9d0e1c7e48ab6c1a/1080.webp"
        }
      ],
      "support_service": [
        "Technical Support",
        "Delivery Service",
        "Equipment with or without operator available",
        "Maintenance Service"
      ],
      "served_locations": [
        "Sullivan County, NY",
        "Monticello, NY",
        "Liberty, NY",
        "Middletown, NY",
        "Orange County, NY",
        "Hudson Valley, NY"
      ],
      "shipping_returns": "Fast delivery with in-house transportation team handling delivery and pickup directly to job sites. Equipment must be picked up within 14 days of receiving cleared payment unless other arrangements are made in advance.",
      "key_features_usps": [
        "Compact and nimble design ideal for residential lots and tight spaces",
        "Attachment-ready for multiple tasks including brush cutter, auger, and grapple",
        "Well-maintained fleet serviced regularly and ready to work",
        "Flexible daily, weekly, and monthly rental rates available"
      ],
      "ownership_options": [
        "Purchase",
        "Rent"
      ],
      "product_identifier": null,
      "pricing_information": "Pricing Available on Request",
      "applications_use_cases": [
        "Residential lot clearing and cleanup",
        "Construction site material handling",
        "Landscaping and grading projects",
        "Debris cleanup and loading",
        "Tight driveway and confined space work",
        "General site work and backfilling"
      ],
      "regulatory_information": [],
      "associate_certifications": [],
      "technical_specifications": {
        "Type": "Skid Steer Loader",
        "Category": "Compact equipment",
        "Applications": "Material handling, site cleanup, brush cutting, backfill, grading, digging, loading"
      }
    }
  },
  {
    "name": "Skid Steer Loader",
    "details": {
      "image_id": "refined-images/1775483271876068_ad8156d437b047458bdde69c60ef2e83",
      "filter_data": {
        "Size Class": [
          "Standard"
        ],
        "Equipment Type": [
          "Skid Steer"
        ],
        "Primary Application": [
          "Material Handling & Loading",
          "Landscaping & Grading",
          "Debris Cleanup & Site Clearing"
        ],
        "Attachment Configuration": [
          "Multi-Attachment Compatible"
        ]
      },
      "product_key": "Skid steer",
      "manufacturer": "Multiple manufacturers including John Deere and CAT",
      "product_name": "Skid Steer Loader",
      "product_media": [
        {
          "url": "https://file-host.link/website/rossiniequipmentcorp-ke4ofc/assets/refined-images/1775483271876068_ad8156d437b047458bdde69c60ef2e83/1080.webp"
        }
      ],
      "support_service": [
        "Equipment rental with or without operator",
        "Full hire services with experienced operators",
        "Expert servicing and preventative maintenance",
        "On-site servicing to minimize downtime",
        "Transportation and delivery services",
        "Personal inspections strongly recommended and encouraged before purchase"
      ],
      "served_locations": [
        "Sullivan County, NY",
        "Monticello, NY",
        "Liberty, NY",
        "Middletown, NY",
        "Orange County, NY",
        "Hudson Valley, NY"
      ],
      "shipping_returns": "Fast delivery with in-house transportation team handling delivery and pickup directly to job sites. Equipment must be picked up within 14 days of receiving cleared payment unless other arrangements are made in advance. All sales are final with no warranties or guarantees on used equipment sold as-is.",
      "key_features_usps": [
        "Compact and nimble design ideal for tight spaces and residential lots",
        "Vertical lift design for improved reach and truck loading capabilities",
        "Attachment-ready with compatibility for buckets, forks, augers, sweepers, brush cutters, and grapples",
        "Superior traction and flotation on soft, muddy, or uneven ground with rubber track options",
        "Spacious sealed cab with heat/AC option and low effort controls for all-day operator comfort"
      ],
      "ownership_options": [
        "Purchase",
        "Rent"
      ],
      "product_identifier": "Multiple models available including John Deere 318G and CAT 257D",
      "pricing_information": "Purchase prices range from $12,000 to $40,000 depending on model. Rental rates: $300-$450 per day, $900-$1,350 per week. Monthly rates available upon request. Hire with skilled operator available with project-specific quotes.",
      "applications_use_cases": [
        "Construction site material handling and grading",
        "Residential lot clearing and landscaping",
        "Agricultural operations",
        "Driveway prep and grading",
        "Drainage trenching and utility work",
        "Debris cleanup and loading with grapple attachment",
        "Post holes and fence line installation with auger attachment",
        "Site clearing and cleanup"
      ],
      "regulatory_information": [
        "Tier 4 Final emissions compliance for newer models",
        "ROPS-certified operator cab for safety"
      ],
      "associate_certifications": [
        "ROPS-certified cab"
      ],
      "technical_specifications": {
        "Track Type": "Rubber tracks for reduced ground disturbance",
        "CAT 941B Year": "1980",
        "CAT 257D Engine": "Cat C3.3B DIT (ACERT) Diesel (74 hp / 55.4 kW)",
        "CAT 257D Travel Speed": "Up to 7.6 mph (12.2 km/h) High Range",
        "John Deere 318G Engine": "65 HP Yanmar 4TNV86CHT - Tier 4 Final",
        "CAT 257D Operating Weight": "Approx. 9,000 lbs (4,082 kg)",
        "John Deere 318G Travel Speed": "Up to 7 mph (two-speed optional)",
        "John Deere 318G Operating Weight": "~6,542 lbs",
        "CAT 257D Rated Operating Capacity": "Approx. 3,100 lbs (1,406 kg)",
        "John Deere 318G Rated Operating Capacity": "1,945 lbs"
      }
    }
  },
  {
    "name": "6' Brush Cutter Attachment",
    "details": {
      "image_id": "refined-images/1775483268813805_f06625fa6d1c4006a5aaaac06a541b9f",
      "product_key": "Skid steer brush cutter",
      "manufacturer": "AGT Industrial",
      "product_name": "6' Brush Cutter Attachment",
      "product_media": [
        {
          "url": "https://file-host.link/website/rossiniequipmentcorp-ke4ofc/assets/refined-images/1775483268813805_f06625fa6d1c4006a5aaaac06a541b9f/1080.webp"
        }
      ],
      "support_service": [
        "Equipment rental services available",
        "Contact for project-specific quotes and support"
      ],
      "served_locations": [
        "Monticello, NY",
        "Sullivan County, NY",
        "Hudson Valley, NY"
      ],
      "shipping_returns": "Available for rent or purchase in Monticello, NY. Contact for delivery and pickup arrangements.",
      "key_features_usps": [
        "Heavy-duty 3/16 inch thick steel deck construction for durability",
        "Direct drive hydraulic motor with one-way check valve for reliable power transmission and reduced maintenance",
        "Two durable 5/8 inch thick AR400 steel blades capable of cutting material up to 4 inches in diameter",
        "Front-opening mowing design enhances cutting efficiency",
        "Includes hydraulic hoses and flat-faced couplers for easy and quick connection"
      ],
      "ownership_options": [
        "Purchase",
        "Rent"
      ],
      "product_identifier": "AGT-RC72",
      "pricing_information": "Purchase price: Coming Soon. Rental rates: $225 per day, $675 per week, call for monthly pricing.",
      "applications_use_cases": [
        "Land clearing",
        "Vegetation management",
        "Landscaping",
        "Agriculture",
        "Construction site preparation"
      ],
      "regulatory_information": null,
      "associate_certifications": null,
      "technical_specifications": {
        "Model": "AGT-RC72 Skid Steer Brush Cutter",
        "Blades": "2 pieces, 5/8 inch thick AR400 steel",
        "Weight": "Approximately 780 lbs",
        "Connection": "Includes hydraulic hoses and 1/2 inch flat-faced couplers",
        "Drive System": "Direct drive hydraulic motor with right-angle gearbox and one-way check valve",
        "Compatibility": "Compatible with standard flow skid steer loaders",
        "Cutting Width": "72 inches",
        "Deck Thickness": "3/16 inch heavy-duty steel",
        "Working Pressure": "17 MPa (2,466 psi)",
        "Required Flow Rate": "12-16 GPM (45-60 L/min)",
        "Max Cutting Capacity": "4 inches diameter",
        "Dimensions (L x W x H)": "77.95 inches x 74.80 inches x 18.50 inches"
      }
    }
  },
  {
    "name": "Skid Steer Auger Attachment",
    "details": {
      "image_id": "refined-images/1775483261386293_562df1658c314b76b892ded3e6270b35",
      "product_key": "Skid steer auger",
      "manufacturer": "AGT Industrial",
      "product_name": "Skid Steer Auger Attachment",
      "product_media": [
        {
          "url": "https://file-host.link/website/rossiniequipmentcorp-ke4ofc/assets/refined-images/1775483261386293_562df1658c314b76b892ded3e6270b35/1080.webp"
        }
      ],
      "support_service": [
        "Technical Support",
        "Delivery Service",
        "Equipment Maintenance"
      ],
      "served_locations": [
        "Sullivan County, NY",
        "Monticello, NY",
        "Liberty, NY",
        "Middletown, NY",
        "Orange County, NY"
      ],
      "shipping_returns": "Fast delivery with in-house transportation team handling delivery and pickup directly to job sites. Specific return policies and warranty details available upon request.",
      "key_features_usps": [
        "Hydraulically operated for consistent power and performance",
        "Compatible with most skid steer loaders and compact track loaders",
        "Ideal for drilling post holes and fence line installations",
        "Available for flexible rental terms or outright purchase"
      ],
      "ownership_options": [
        "Rent",
        "Purchase"
      ],
      "product_identifier": null,
      "pricing_information": "Pricing Available on Request",
      "applications_use_cases": [
        "Post hole drilling for fence installations",
        "Foundation pier drilling",
        "Landscaping and tree planting",
        "Agricultural fencing projects",
        "Construction site preparation"
      ],
      "regulatory_information": [],
      "associate_certifications": [],
      "technical_specifications": {
        "Applications": "Post holes, fence line installation",
        "Drive System": "Hydraulic",
        "Compatibility": "Compatible with skid steers and compact track loaders"
      }
    }
  },
  {
    "name": "Bobcat Mini Skid Steer",
    "details": {
      "product_key": "Bobcat mini skid steer",
      "manufacturer": "Bobcat",
      "product_name": "Bobcat Mini Skid Steer",
      "support_service": [
        "Equipment rental with flexible daily, weekly, and monthly rates",
        "Hire with skilled operator available",
        "On-site servicing to minimize downtime",
        "Technical guidance and project consultation"
      ],
      "served_locations": [
        "Sullivan County, NY",
        "Monticello, NY",
        "Liberty, NY",
        "Middletown, NY",
        "Hudson Valley, NY"
      ],
      "shipping_returns": "Local pickup available in Monticello, NY. Delivery services available to Sullivan County and surrounding Hudson Valley areas. Contact for specific delivery arrangements and terms.",
      "key_features_usps": [
        "Compact design ideal for tight spaces and residential lots",
        "Versatile attachment compatibility for multiple applications",
        "Efficient material handling and site cleanup capabilities",
        "Superior maneuverability for confined work areas"
      ],
      "ownership_options": [
        "Purchase",
        "Rent"
      ],
      "product_identifier": null,
      "pricing_information": "Pricing Available on Request",
      "applications_use_cases": [
        "Residential lot clearing and landscaping",
        "Construction site cleanup and debris removal",
        "Material handling and loading operations",
        "Grading and site preparation",
        "Backyard and small-scale excavation projects"
      ],
      "regulatory_information": [],
      "associate_certifications": [],
      "technical_specifications": {}
    }
  },
  {
    "name": "Bobcat Mini Excavator",
    "details": {
      "product_key": "Bobcat mini excavator",
      "manufacturer": "Bobcat",
      "product_name": "Bobcat Mini Excavator",
      "support_service": [
        "Equipment rental with or without operator",
        "Hire with skilled operator available",
        "Expert servicing and preventative maintenance",
        "On-site servicing to minimize downtime",
        "Transportation and delivery service"
      ],
      "served_locations": [
        "Sullivan County, NY",
        "Monticello, NY",
        "Liberty, NY",
        "Middletown, NY",
        "Orange County, NY",
        "Hudson Valley, NY"
      ],
      "shipping_returns": "Fast delivery with in-house transportation team handling delivery and pickup directly to job sites. Equipment can be rented with flexible daily, weekly, and monthly rental rates.",
      "key_features_usps": [
        "Compact design ideal for tight spaces and confined work areas",
        "Versatile performance for residential lots, backyard drainage projects, and sites with limited access",
        "Rubber tracks provide excellent traction and flotation while minimizing ground disturbance",
        "Compatible with various attachments for enhanced versatility",
        "Suitable for excavation, trenching, utility work, and general construction projects"
      ],
      "ownership_options": [
        "Rent",
        "Purchase"
      ],
      "product_identifier": null,
      "pricing_information": "Pricing Available on Request",
      "applications_use_cases": [
        "Residential lot excavation and backyard projects",
        "Drainage and utility trenching",
        "Landscaping and site cleanup",
        "Foundation preparation for residential construction",
        "General construction and site work in confined spaces"
      ],
      "regulatory_information": [],
      "associate_certifications": [],
      "technical_specifications": {
        "Equipment Type": "Mini Excavator",
        "Operating Class": "Compact excavation equipment",
        "Primary Applications": "Excavation, trenching, utility work, grading, backfilling, general construction"
      }
    }
  },
  {
    "name": "Skid Steer Power Rake",
    "details": {
      "product_key": "Skid steer power rake",
      "manufacturer": null,
      "product_name": "Skid Steer Power Rake",
      "support_service": [
        "Equipment delivery and pickup service",
        "Rental with or without operator available",
        "Technical guidance from experienced team"
      ],
      "served_locations": [
        "Sullivan County, NY",
        "Monticello, NY",
        "Liberty, NY",
        "Middletown, NY",
        "Hudson Valley, NY"
      ],
      "shipping_returns": "Fast delivery with in-house transportation team handling delivery and pickup directly to job sites. Equipment must be picked up within 14 days of receiving cleared payment unless other arrangements are made in advance.",
      "key_features_usps": [
        "Compatible with skid steers and compact track loaders",
        "Ideal for site preparation and grading applications",
        "Available through flexible daily, weekly, and monthly rental rates"
      ],
      "ownership_options": [
        "Rent"
      ],
      "product_identifier": null,
      "pricing_information": "Pricing Available on Request",
      "applications_use_cases": [
        "Site grading and preparation",
        "Landscaping projects",
        "Construction site work",
        "Material handling and leveling"
      ],
      "regulatory_information": [],
      "associate_certifications": [],
      "technical_specifications": {}
    }
  },
  {
    "name": "Skid Steer with Grapple Attachment",
    "details": {
      "image_id": "refined-images/1775483272739601_4d05453b29ee4185908509c0118b8358",
      "filter_data": {
        "Size Class": [
          "Standard"
        ],
        "Equipment Type": [
          "Skid Steer"
        ],
        "Primary Application": [
          "Material Handling & Loading",
          "Landscaping & Grading",
          "Debris Cleanup & Site Clearing"
        ],
        "Attachment Configuration": [
          "Grapple-Equipped",
          "Multi-Attachment Compatible"
        ]
      },
      "product_key": "Skid steer with grapple",
      "manufacturer": "Multiple manufacturers available (CAT, John Deere, AGT Industrial)",
      "product_name": "Skid Steer with Grapple Attachment",
      "product_media": [
        {
          "url": "https://file-host.link/website/rossiniequipmentcorp-ke4ofc/assets/refined-images/1775483272739601_4d05453b29ee4185908509c0118b8358/1080.webp"
        }
      ],
      "support_service": [
        "Technical Support",
        "Hire with Skilled Operator available",
        "Equipment delivery and pickup service",
        "On-site servicing to minimize downtime",
        "Maintenance and preventative servicing",
        "Expert guidance on equipment selection and attachments"
      ],
      "served_locations": [
        "Sullivan County, NY",
        "Monticello, NY",
        "Liberty, NY",
        "Middletown, NY",
        "Hudson Valley, NY",
        "Orange County, NY"
      ],
      "shipping_returns": "Fast delivery with in-house transportation team handling delivery and pickup directly to job sites throughout Sullivan County and Hudson Valley region. Equipment must be picked up within 14 days of cleared payment for purchased items. Local pickup available at Monticello, NY location.",
      "key_features_usps": [
        "Compact and agile design for tight spaces and residential lots",
        "Rubber tracks provide superior traction and flotation across various terrains with minimal ground disturbance",
        "Versatile attachment compatibility including grapples for debris cleanup and material handling",
        "Powerful hydraulics with vertical lift design for improved reach and truck loading",
        "Enclosed cab with HVAC option for all-day operator comfort and excellent visibility"
      ],
      "ownership_options": [
        "Purchase",
        "Rent"
      ],
      "product_identifier": null,
      "pricing_information": "Skid steer purchase prices range from $12,000 to $40,000. Rental rates: $300-$450 per day, $900-$1,350 per week. Monthly rates available upon request. Grapple attachment rental: pricing varies by attachment type. Volume and project-specific pricing available.",
      "applications_use_cases": [
        "Material handling and debris cleanup on construction sites",
        "Landscaping and site clearing with grapple attachments",
        "Grading and digging operations",
        "Loading trucks and stacking pallets",
        "Brush and vegetation removal",
        "General site work and construction support",
        "Agricultural applications",
        "Residential lot cleanup and property maintenance"
      ],
      "regulatory_information": [
        "ROPS-compliant cab for operator safety",
        "Tier 4 Final emissions compliance (John Deere 318G)",
        "No CDL required to operate most compact equipment for homeowners"
      ],
      "associate_certifications": [
        "ROPS-compliant cab"
      ],
      "technical_specifications": {
        "Hydraulics": "Standard and high flow optional for multiple attachment compatibility",
        "CAT 257D Engine": "Cat C3.3B DIT (ACERT) Diesel (74 hp / 55.4 kW)",
        "CAT 257D Lift Type": "Vertical Lift",
        "CAT 257D Travel Speed": "Up to 7.6 mph (12.2 km/h)",
        "John Deere 318G Engine": "65 HP Yanmar 4TNV86CHT \\u2013 Tier 4 Final",
        "Attachment Compatibility": "Buckets, forks, augers, sweepers, grapples, and more",
        "CAT 257D Operating Weight": "Approx. 9,000 lbs (4,082 kg)",
        "John Deere 318G Travel Speed": "Up to 7 mph (two-speed optional)",
        "John Deere 318G Operating Weight": "~6,542 lbs",
        "CAT 257D Rated Operating Capacity": "Approx. 3,100 lbs (1,406 kg)",
        "John Deere 318G Rated Operating Capacity": "1,945 lbs"
      }
    }
  },
  {
    "name": "Dingo Skid Steer",
    "details": {
      "product_key": "Dingo skid steer",
      "manufacturer": null,
      "product_name": "Dingo Skid Steer",
      "support_service": [
        "Equipment rental services",
        "Delivery and pickup service",
        "Expert servicing and preventative maintenance",
        "On-site servicing to minimize downtime"
      ],
      "served_locations": [
        "Sullivan County, NY",
        "Monticello, NY",
        "Liberty, NY",
        "Middletown, NY",
        "Orange County, NY"
      ],
      "shipping_returns": "Fast delivery with in-house transportation team handling delivery and pickup directly to job sites. Flexible daily, weekly, and monthly rental rates available.",
      "key_features_usps": [
        "Compact and nimble design ideal for residential lots and tight spaces",
        "Attachment-ready for versatile applications including brush cutting, augers, and grapples",
        "Superior maneuverability for confined work areas"
      ],
      "ownership_options": [
        "Rent",
        "Purchase"
      ],
      "product_identifier": null,
      "pricing_information": "Pricing Available on Request",
      "applications_use_cases": [
        "Residential lot clearing and maintenance",
        "Tight driveway work",
        "Small clearing jobs",
        "Material handling and site cleanup",
        "Landscaping projects",
        "Construction support tasks"
      ],
      "regulatory_information": [],
      "associate_certifications": [],
      "technical_specifications": {}
    }
  },
  {
    "name": "Skid Steer Trencher",
    "details": {
      "product_key": "Skid steer trencher",
      "manufacturer": null,
      "product_name": "Skid Steer Trencher",
      "support_service": [
        "Equipment rental with or without operator",
        "In-house transportation team for delivery and pickup",
        "Expert servicing and preventative maintenance available",
        "On-site servicing to minimize downtime"
      ],
      "served_locations": [
        "Sullivan County, NY",
        "Monticello, NY",
        "Liberty, NY",
        "Middletown, NY",
        "Orange County, NY",
        "Hudson Valley, NY"
      ],
      "shipping_returns": "Fast delivery with in-house transportation team handling delivery and pickup directly to job sites. Specific return policies and warranty details available upon request.",
      "key_features_usps": [
        "Designed specifically for utility installs, drainage runs, and sewer lines",
        "Far faster than excavating a trench with a backhoe when the run is long and straight",
        "Ideal for cutting utility lines across properties",
        "Compatible with skid steer loaders and compact track loaders"
      ],
      "ownership_options": [
        "Rent"
      ],
      "product_identifier": null,
      "pricing_information": "Pricing Available on Request",
      "applications_use_cases": [
        "Utility installations",
        "Drainage runs",
        "Sewer line installation",
        "Long straight trench cutting",
        "Utility line installation across properties"
      ],
      "regulatory_information": [],
      "associate_certifications": [],
      "technical_specifications": {}
    }
  },
  {
    "name": "Excavator",
    "details": {
      "image_id": "refined-images/1775483293238398_8648f220821f4b22b7dc1fa62ca05aeb",
      "filter_data": {
        "Size Class": [
          "Mini / Compact",
          "Standard",
          "Large"
        ],
        "Equipment Type": [
          "Excavator"
        ],
        "Primary Application": [
          "Excavation & Trenching",
          "Material Handling & Loading",
          "Landscaping & Grading"
        ],
        "Attachment Configuration": [
          "Multi-Attachment Compatible"
        ]
      },
      "product_key": "Excavator",
      "manufacturer": "Multiple manufacturers including CAT (Caterpillar), Hitachi, AGT Industrial",
      "product_name": "Excavator",
      "product_media": [
        {
          "url": "https://file-host.link/website/rossiniequipmentcorp-ke4ofc/assets/refined-images/1775483293238398_8648f220821f4b22b7dc1fa62ca05aeb/1080.webp"
        }
      ],
      "support_service": [
        "Hire with skilled operator available for project-specific needs",
        "Expert servicing and preventative maintenance to optimize performance and extend equipment lifespan",
        "On-site servicing to minimize downtime on active job sites",
        "Technical guidance and on-site assistance from experienced team",
        "Fast delivery and pickup with in-house transportation team"
      ],
      "served_locations": [
        "Monticello, NY",
        "Sullivan County, NY",
        "Liberty, NY",
        "Middletown, NY",
        "Orange County, NY",
        "Hudson Valley, NY"
      ],
      "shipping_returns": "Fast delivery with in-house transportation team handling delivery and pickup directly to job sites throughout Sullivan County and Middletown/Orange County region. Specific return policies and warranty details not specified in available information.",
      "key_features_usps": [
        "Compact radius design for working effectively in confined spaces while maintaining excellent stability",
        "Advanced hydraulic systems including TRIAS system with variable displacement pumps for higher productivity and fuel savings",
        "Enclosed ROPS-certified cabs with automatic climate control and excellent visibility for operator comfort",
        "Durable rubber tracks providing excellent traction and flotation while minimizing ground disturbance",
        "Versatile attachment compatibility including buckets, breakers, augers, and grapples for multiple applications"
      ],
      "ownership_options": [
        "Purchase",
        "Rent",
        "Hire with skilled operator"
      ],
      "product_identifier": "Multiple models available including CAT 308E2 CR, CAT 313F L GC, Hitachi ZX290LC-5N, AGT QH12",
      "pricing_information": "Purchase prices range from $7,000 (1-ton mini excavator) to $73,000 (14-ton excavator). Rental rates: Per Day $300-$1,300, Per Week $900-$3,900, Per Month pricing available upon request. Hire with skilled operator pricing available via contact for project-specific quotes.",
      "applications_use_cases": [
        "Excavation and trenching for foundations and utility work",
        "Site grading, backfilling, and general construction projects",
        "Heavy excavation, site preparation, loading, and demolition",
        "Landscaping, light construction, and utility projects in tight spaces",
        "Material handling, digging, and lifting with precision and efficiency"
      ],
      "regulatory_information": [
        "ROPS (Roll-Over Protective Structure) certified cabs for operator safety",
        "Tier 4 Final emissions compliance (select models)",
        "No DEF (Diesel Exhaust Fluid) required on certain models to meet emissions standards"
      ],
      "associate_certifications": [
        "ROPS-compliant cab"
      ],
      "technical_specifications": {
        "AGT QH12 - Engine": "13.5 HP Briggs & Stratton gasoline engine",
        "CAT 308E2 CR - Engine": "Diesel Engine (Cat C3.3B)",
        "CAT 313F L GC - Engine": "Cat C3.4B Diesel (74 hp / 55 kW)",
        "AGT QH12 - Operating Weight": "Approximately 1 ton (2,200 lbs / 1,000 kg)",
        "Hitachi ZX290LC-5N - Engine": "Isuzu AH-4HK1X (188 hp / 140 kW)",
        "AGT QH12 - Max Digging Depth": "Approximately 5.4 ft (1.65 m)",
        "CAT 308E2 CR - Operating Weight": "Approx. 17,960 lb (8146 kg)",
        "CAT 313F L GC - Operating Weight": "Approx. 29,300 lbs (13,300 kg)",
        "CAT 308E2 CR - Maximum Digging Depth": "13 ft 6 in (4109 mm)",
        "CAT 313F L GC - Maximum Digging Depth": "19 ft 9 in (6040 mm)",
        "Hitachi ZX290LC-5N - Operating Weight": "Approx. 63,273 lbs (28,700 kg)",
        "Hitachi ZX290LC-5N - Maximum Digging Depth": "25 ft 10 in (7.88 m)",
        "CAT 308E2 CR - Maximum Reach at Ground Level": "22 ft 10 in (6949 mm)",
        "CAT 313F L GC - Maximum Reach at Ground Line": "26 ft 10 in (8620 mm)",
        "Hitachi ZX290LC-5N - Maximum Reach at Ground Level": "36 ft 5 in (11.10 m)"
      }
    }
  },
  {
    "name": "Skid Steer Stump Grinder",
    "details": {
      "product_key": "Skid steer stump grinder",
      "manufacturer": null,
      "product_name": "Skid Steer Stump Grinder",
      "support_service": [
        "Equipment rental with or without operator",
        "Delivery and pickup service",
        "Technical support available",
        "Maintenance service for rental equipment"
      ],
      "served_locations": [
        "Sullivan County, NY",
        "Monticello, NY",
        "Middletown, NY",
        "Orange County, NY",
        "Hudson Valley, NY"
      ],
      "shipping_returns": "Fast delivery with in-house transportation team handling delivery and pickup directly to job sites throughout Sullivan County and Middletown/Orange County region.",
      "key_features_usps": [
        "Compatible with skid steer loaders and compact track loaders",
        "Efficient stump removal and grinding capabilities",
        "Hydraulically operated attachment for powerful performance",
        "Available with flexible rental terms including daily, weekly, and monthly rates"
      ],
      "ownership_options": [
        "Rent"
      ],
      "product_identifier": null,
      "pricing_information": "Pricing Available on Request",
      "applications_use_cases": [
        "Land clearing and site preparation",
        "Stump removal for residential and commercial properties",
        "Tree service and forestry work",
        "Landscaping and property maintenance",
        "Construction site cleanup"
      ],
      "regulatory_information": [],
      "associate_certifications": [],
      "technical_specifications": {}
    }
  },
  {
    "name": "Skid Steer Attachments",
    "details": {
      "image_id": "refined-images/1775483308642024_d1091ea08ffc4153b8d937728fa1fb9a",
      "product_key": "Skid steer attachment",
      "manufacturer": "AGT Industrial, Trojan",
      "product_name": "Skid Steer Attachments",
      "product_media": [
        {
          "url": "https://file-host.link/website/rossiniequipmentcorp-ke4ofc/assets/refined-images/1775483308642024_d1091ea08ffc4153b8d937728fa1fb9a/1080.webp"
        }
      ],
      "support_service": [
        "Equipment rental with or without operator available",
        "Flexible daily, weekly, and monthly rental rates",
        "In-house transportation team for delivery and pickup",
        "Expert servicing and preventative maintenance available",
        "Technical support and project consultation"
      ],
      "served_locations": [
        "Monticello, NY",
        "Sullivan County, NY",
        "Middletown, NY",
        "Orange County, NY"
      ],
      "shipping_returns": "Local pickup available in Monticello, NY. Fast delivery with in-house transportation team handling delivery and pickup directly to job sites throughout Sullivan County and surrounding areas. Buyer responsible for arranging and paying for all shipping logistics for purchased equipment.",
      "key_features_usps": [
        "Hydraulically operated attachments with high torque motors for efficient performance",
        "Heavy-duty steel construction with AR400 steel blades for durability in demanding environments",
        "Universal quick-attach compatibility with standard flow skid steer loaders and compact track loaders",
        "Rotating debris chutes and adjustable material hoppers for ease of use",
        "Includes hydraulic hoses and flat-faced couplers for easy and quick connection"
      ],
      "ownership_options": [
        "Purchase",
        "Rent"
      ],
      "product_identifier": null,
      "pricing_information": "Rental pricing available: Per Day rates range from $225-$250, Per Week rates range from $675-$750. Purchase prices listed as 'Coming Soon' for most attachments. Trojan 35CL Hydraulic Breaker available for purchase at $3,500. Monthly rental pricing available upon request.",
      "applications_use_cases": [
        "Land clearing and debris management",
        "Vegetation management and brush clearing",
        "Construction site cleanup and parking lot sweeping",
        "Demolition, concrete breaking, and rock excavation",
        "Road maintenance and material spreading",
        "Chipping branches and wood processing",
        "Landscaping, agriculture, and construction applications"
      ],
      "regulatory_information": [],
      "associate_certifications": [],
      "technical_specifications": {
        "Sweeper Broom": "Width: 72 inches, Drive: Hydraulic, Bristles: Durable blue poly bristles, Connection: Universal quick-attach plate",
        "Brush Cutter (AGT-RC72)": "Cutting Width: 72 inches, Max Cutting Capacity: 4 inches, Flow Rate: 12-16 GPM, Blades: 2 pieces 5/8 inch thick AR400 steel, Deck Thickness: 3/16 inch steel, Weight: 780 lbs, Dimensions: 77.95x74.80x18.50 inches",
        "Wood Chipper (AGT-SSBX42S)": "Chipping Capacity: 4-inch diameter, Flow Rate: 11-16 GPM, Blades: 4 rotor + 1 fixed, Rotor Size: 25 inches, Hopper Opening: 20x20 inches, Dimensions: 57x49x76 inches, Weight: 682.8 kg (1,505 lbs)",
        "Hydraulic Breaker (Trojan 35CL)": "Pin Size: 40mm, Compatibility: 3.5-ton class excavators including Cat 303/303.5/304, Case/NH/Kob SK35, Deere/Hitachi 35, Sany SY35"
      }
    }
  },
  {
    "name": "Mini Skid Steer Mulcher",
    "details": {
      "product_key": "Mini skid steer mulcher",
      "manufacturer": null,
      "product_name": "Mini Skid Steer Mulcher",
      "support_service": [
        "Equipment rental with or without operator",
        "Experienced operators available for hire",
        "On-site servicing to minimize downtime",
        "Technical guidance and support"
      ],
      "served_locations": [
        "Sullivan County, NY",
        "Monticello, NY",
        "Liberty, NY",
        "Middletown, NY",
        "Orange County, NY"
      ],
      "shipping_returns": "Fast delivery with in-house transportation team handling delivery and pickup directly to job sites. Flexible daily, weekly, and monthly rental rates available.",
      "key_features_usps": [
        "Compatible with skid steers and compact track loaders",
        "Ideal for land clearing and vegetation management",
        "Hydraulically operated for efficient performance"
      ],
      "ownership_options": [
        "Rent"
      ],
      "product_identifier": null,
      "pricing_information": "Pricing Available on Request",
      "applications_use_cases": [
        "Land clearing",
        "Vegetation management",
        "Landscaping",
        "Construction site preparation",
        "Brush and overgrowth removal"
      ],
      "regulatory_information": [],
      "associate_certifications": [],
      "technical_specifications": {}
    }
  },
  {
    "name": "Backhoe Loader",
    "details": {
      "product_key": "Backhoe",
      "manufacturer": null,
      "product_name": "Backhoe Loader",
      "support_service": [
        "Technical guidance and equipment selection assistance available",
        "Operator hire service available with equipment rental",
        "On-site delivery to job sites"
      ],
      "served_locations": [
        "Sullivan County, NY",
        "Monticello, NY",
        "Liberty, NY",
        "Middletown, NY",
        "Hudson Valley, NY"
      ],
      "shipping_returns": "Delivery available to job sites in Sullivan County and surrounding Hudson Valley areas. Flexible daily, weekly, and monthly rental terms. Equipment must be returned at end of rental period.",
      "key_features_usps": [
        "Dig with the back, load with the front - dual functionality in one machine",
        "Workhorse for utility work, drainage installs, and residential foundation prep",
        "Strong value pick for mid-range jobs where both digging and loading functions are needed without renting two separate machines",
        "Well-maintained fleet serviced regularly and ready to work"
      ],
      "ownership_options": [
        "Rent"
      ],
      "product_identifier": null,
      "pricing_information": "Pricing Available on Request",
      "applications_use_cases": [
        "Utility work and utility installs",
        "Drainage installations",
        "Residential foundation preparation",
        "Mid-sized excavation jobs requiring both digging and material moving capabilities"
      ],
      "regulatory_information": [],
      "associate_certifications": [],
      "technical_specifications": {}
    }
  }
]`,
  paaDataJson: `[
  "What is the average life of an excavator?",
  "Is buying an excavator a good investment?",
  "Is 3000 hours a lot for an excavator?",
  "Do excavators hold their value?"
]`,
};

const CLIENT_SENTINEL_ASSET_MANAGEMENT: ClientSample = {
  id: `a3af9ee4-e6c1-4003-a444-092618be6867`,
  slug: `sentinel-asset-management`,
  name: `Sentinel Asset Management`,
  url: `https://sentinelassetmanagementllc.com/`,
  primaryLogoUrl: `https://file-host.link/website/sentinelassetmanagementllc-lo1ayr/assets/logo/logo.webp`,
  sampleServiceTopic: `Estate Planning Services — Financial Security`,
  sampleCategoryTopic: ``,
  sampleBlogTopic: `Estate Tax Planning: A Complete Guide`,
  designTokensJson: `{
  "fonts": {
    "body_font_url": "https://fonts.googleapis.com/css2?family=Inter:wght@300..700&display=swap",
    "heading_font_url": "https://fonts.googleapis.com/css2?family=Urbanist:wght@300..700&display=swap"
  },
  "css_variables": {
    "--color-brand-text": "#0d1f24",
    "--font-family-body": "Inter, ui-sans-serif, system-ui, sans-serif",
    "--color-brand-primary": "#183239",
    "--font-family-heading": "Urbanist, ui-sans-serif, system-ui, sans-serif",
    "--color-brand-secondary": "#1e8a9e",
    "--color-brand-text-muted": "#7a9ea8",
    "--color-brand-primary-dark": "#0a1a1f",
    "--color-brand-text-inverse": "#ffffff",
    "--color-brand-text-primary": "#0d1f24",
    "--color-brand-primary-hover": "#0f2229",
    "--color-brand-primary-light": "rgba(24, 50, 57, 0.05)",
    "--color-brand-text-tertiary": "#4a7382",
    "--color-brand-primary-medium": "rgba(24, 50, 57, 0.1)",
    "--color-brand-secondary-dark": "#0f5f70",
    "--color-brand-text-secondary": "#2c4f58",
    "--color-brand-secondary-hover": "#167484",
    "--color-brand-secondary-light": "rgba(30, 138, 158, 0.05)",
    "--color-brand-secondary-medium": "rgba(30, 138, 158, 0.1)",
    "--color-brand-primary-foreground": "#ffffff",
    "--color-brand-secondary-foreground": "#ffffff"
  }
}`,
  companyInfoJson: `{
  "name": {
    "dba_name": null,
    "legal_name": "Sentinel Asset Management, LLC.",
    "company_name": "Sentinel Asset Management"
  },
  "founded": {
    "founded_date_year": null,
    "years_in_business": "100+ years of combined advisory experience"
  },
  "locations": {
    "branch_locations": [
      "1073 North Benson Road, Fairfield, CT, 06842",
      "13850 Travilah Road, Rockville, MD, 20850",
      "41 Wyllys Ave., Middletown, CT, 06475",
      "300 Boston Post Rd., West Haven, CT, 06516"
    ],
    "headquarters_address": "4825 Cordell Ave, 2nd Floor, Bethesda, MD, 20814"
  },
  "credentials": {
    "memberships": [],
    "accreditations": [],
    "certifications": [],
    "business_licenses": []
  },
  "company_size": {
    "employee_count": null,
    "annual_turnover": null
  },
  "service_team": {
    "team_members": [],
    "employee_count": null,
    "years_of_experience": 100
  },
  "company_story": {
    "milestones": [
      "25 years working with Families with Special needs",
      "2000+ clients guided into retirement",
      "20+ families with special needs supported long term"
    ],
    "founding_story": null,
    "company_history": "Sentinel Asset Management, LLC. (SAM) is a comprehensive financial services firm committed to assisting individuals and organizations to ensure long-term financial success",
    "growth_narrative": "The firm has grown to support over 2,000 clients through retirement and legacy planning, with 5 offices across the U.S. and 100+ years of combined advisory experience among its team"
  },
  "phone_numbers": [
    "+1 203-793-0707"
  ],
  "service_areas": [
    "Connecticut",
    "Florida",
    "Massachusetts",
    "Maryland",
    "Maine",
    "North Carolina",
    "New Jersey",
    "Pennsylvania",
    "Rhode Island"
  ],
  "working_hours": {
    "Friday": [
      "9AM-3PM"
    ],
    "Monday": [
      "9AM-5PM"
    ],
    "Sunday": [
      "Closed"
    ],
    "Tuesday": [
      "9AM-5PM"
    ],
    "Saturday": [
      "Closed"
    ],
    "Thursday": [
      "9AM-5PM"
    ],
    "Wednesday": [
      "9AM-5PM"
    ]
  },
  "email_addresses": [],
  "major_customers": [],
  "ratings_reviews": {
    "GBP": {
      "rating": null,
      "review_count": null
    }
  },
  "business_category": [
    "Financial consultant"
  ],
  "value_propositions": {
    "key_benefits": [
      "Personalized allocation using model portfolios based on client's investment goals, income needs, tax situation, and tolerance for risk",
      "Globally diversified, tax-efficient portfolios designed to be resilient through market cycles",
      "Minimize lifetime tax liability through coordinated financial ecosystem",
      "Preserve independence and quality of life, no matter how markets behave or how long you live",
      "Wealth reaches the people and causes you care about efficiently, gracefully, and on your terms",
      "Values continue as a living reflection of purpose, discipline, and love for those who follow"
    ],
    "market_positioning": "A comprehensive financial services firm delivering precision, discipline, and portfolios built to endure for individuals and families pursuing long-term financial security and legacy planning",
    "competitive_advantages": [
      "5 offices across the U.S. for personal support",
      "100+ years of combined advisory experience",
      "2,000+ clients supported through retirement and legacy planning",
      "25 years working with Families with Special needs",
      "Team well versed in the financial complexities of divorce from both a personal and professional perspective"
    ],
    "unique_selling_propositions": [
      "Asset management rooted in modern portfolio theory, refined through decades of real-world application",
      "Building on the Nobel Prize–winning work of Harry Markowitz to eliminate unsystematic risk through deliberate diversification",
      "PRIME risk framework: Purchasing Power, Reinvestment, Interest Rate, Market, and Exchange Risk",
      "Every client portfolio is guided by an Investment Policy Statement, stress-tested under different market conditions",
      "Structured withdrawal 'buckets' that pursue insulation against near-term cash flow fluctuations from market volatility",
      "98% of estate planning that doesn't require a lawyer"
    ]
  },
  "awards_recognitions": [],
  "social_media_profiles": {
    "other": [],
    "yelp_url": null,
    "twitter_url": null,
    "youtube_url": null,
    "facebook_url": null,
    "linkedin_url": null,
    "whatsapp_url": null,
    "instagram_url": null
  },
  "target_customer_segments": [
    "Retirement Income Planning",
    "Families with Special Needs",
    "Divorce Financial Planning"
  ],
  "mission_statement_company_values": {
    "vision": null,
    "taglines": [
      "Preserving What Matters",
      "Trusted financial guidance for your future and your family"
    ],
    "core_values": [],
    "mission_statement": "A comprehensive financial services firm committed to supporting individuals and organisations pursuing enduring financial goals, whilst understanding the risks inherent in the market"
  }
}`,
  additionalInfoJson: `{
  "business_profile": {
    "inventory_nature": "100% Professional Services - No physical inventory; delivers financial advisory services, portfolio management, educational courses, and planning strategies",
    "business_identity": "Comprehensive financial services firm providing fiduciary investment advisory, retirement income planning, tax management, risk management, estate planning, and legacy planning for individuals and families",
    "primary_verticals": [
      "Asset Management",
      "Retirement Income Planning",
      "Tax Management",
      "Risk Management",
      "Estate Planning",
      "Legacy Planning"
    ],
    "explicit_out_of_scope": [
      "Physical Products",
      "Retail Goods",
      "Equipment Sales",
      "Parts Distribution",
      "Manufacturing",
      "Wholesale Trade",
      "Consumable Goods",
      "Real Estate Sales",
      "Insurance Product Sales (advisory context only)",
      "Legal Services (coordinates with attorneys but does not provide legal advice)",
      "Tax Preparation Services (provides tax management strategy, not filing)",
      "Accounting Services"
    ]
  }
}`,
  logoUrlsJson: `{
  "favicon": "https://file-host.link/website/sentinelassetmanagementllc-lo1ayr/assets/logo/1775556022088110_85455a504f084624b713c9d14a818e83.png",
  "gbp_url": "https://file-host.link/website/sentinelassetmanagementllc-lo1ayr/assets/logo/1775555766494365_a9354962a5f846cdb8af908e092cbebc.webp",
  "primary_logo": "https://file-host.link/website/sentinelassetmanagementllc-lo1ayr/assets/logo/logo.webp"
}`,
  serviceCatalogJson: `[
  {
    "name": "Financial Planning",
    "details": {
      "service_name": "Financial Planning",
      "service_description": "A great financial plan doesn't just manage money \\u2014 it reflects your life. Sentinel builds comprehensive, personalized plans that integrate your investment goals, income needs, tax situation, and family priorities into one cohesive strategy. From your working years through retirement and beyond, we strive to ensure every piece of your financial picture is working in concert."
    }
  },
  {
    "name": "Retirement Income Planning",
    "details": {
      "availability": "Not specified",
      "service_name": "Retirement Income Planning",
      "pricing_offers": "[\\n    \\"Not specified\\"\\n]",
      "service_description": "Specialized retirement income planning service designed to build a reliable retirement income stream while managing investment risk, recognizing that risk is inherent and income levels may vary. The firm has guided 2000+ clients into retirement with an average plan horizon of 20+ years. The service aims to build a reliable plan for steady income throughout retirement, helping clients fund their lifestyle and legacy."
    }
  },
  {
    "name": "Retirement Income Course",
    "details": {
      "availability": "Multiple dates and times available including: Apr/28/26 6:00 PM - 8:30 PM at Bethesda Green Center; Apr/30/26 6:00 PM - 8:30 PM at Bethesda Green Center; Feb/19/26 6:00 PM - 8:30 PM at Fairfield University (bookings closed); May/26/26 6:00 PM - 8:30 PM at Wesleyan University; Feb/24/26 6:00 PM - 8:30 PM at Goodwin University (bookings closed); Jun/24/26 6:00 PM - 8:30 PM at Shelton Community Center; Apr/22/26 6:00 PM - 8:30 PM at Roger Carter Community Center; May/18/26 6:00 PM - 8:30 PM at Fairfield University; Feb/19/26 6:00 PM - 8:30 PM at Gary J Arthur Community Center (bookings closed); Apr/16/26 6:00 PM - 8:30 PM at Tunxis Community College; Apr/14/26 6:00 PM - 8:30 PM at Tunxis Community College; Feb/26/26 6:00 PM - 8:30 PM at University of New Haven (bookings closed)",
      "service_name": "Retirement Income Course",
      "pricing_offers": "[\\n    \\"$0.00 - Complimentary course with no cost to attend\\"\\n]",
      "service_description": "A complimentary, no obligation, academic course teaching the foundations for a sound retirement. The course is educational in nature and attendance at the event does not create an advisory or fiduciary relationship. Seminar materials are education only and not personalized advice. Attendance at one of the seminars does not create any obligation. The courses are held at various locations including Bethesda Green Center (Conference Room on 2nd floor of Capital One Building) in Maryland at 4825 Cordell Ave, 2nd Floor, Bethesda, MD, 20814; Fairfield University (Center for Nursing and Health Studies Building) in Connecticut at 1073 North Benson Rd, Fairfield, CT, 06824; Wesleyan University (Boger Hall - Room 114) in Connecticut at 41 Wyllys Ave., Middletown, CT, 06475; Goodwin University Main Campus Building (Community Room A) in Connecticut at 211 Riverside Dr., East Hartford, CT, 06118; Shelton Community Center (Craft Room 1) in Connecticut at 41 Church St, Shelton, CT, 06484; Roger Carter Community Center (Rockwell Room) in Maryland at 3000 Milltowne Dr., Ellicott City, MD, 21043; Tunxis Community College (Room 2-213) in Connecticut at 271 Scott Swamp Rd., Farmington, CT, 06032; University of New Haven West Haven Campus (Maxcy Hall - Room 118 and 126) in Connecticut at 300 Boston Post Rd., West Haven, CT, 06516; and Gary J Arthur Community Center (Patapsco Room) in Maryland at 2400 Route 97, Cooksville, MD, 21723. The courses fill up fast with limited spaces (typically 12 spaces per session)."
    }
  },
  {
    "name": "Estate Planning",
    "details": {
      "availability": "Not specified",
      "service_name": "Estate Planning",
      "pricing_offers": "[\\n    \\"Not specified\\"\\n]",
      "service_description": "Estate planning service that coordinates the legal, financial, and personal considerations of a client's estate to ensure planning is structured thoughtfully and intentionally, with the goal of reducing unnecessary tax exposure, public disclosure, and court interference. The service organizes assets across the three U.S. tax categories (taxable, tax-deferred, and tax-free) and develops strategies intended to support orderly transitions between them over time. Advisors review titling, beneficiary designations, wills, and trusts for consistency and alignment, and collaborate with estate attorneys when more complex planning instruments are appropriate. The service focuses on the 98% of estate planning that doesn't require a lawyer, working with accounts, insurance policies, and ownership structures. The goal is efficient transfer of assets with minimized taxes, probate avoidance, and aligned distributions, ensuring wealth reaches the people and causes clients care about efficiently, gracefully, and on their terms."
    }
  },
  {
    "name": "Families with Special Needs",
    "details": {
      "availability": "Not specified",
      "service_name": "Families with Special Needs",
      "pricing_offers": "[\\n    \\"Not specified\\"\\n]",
      "service_description": "Financial planning service intentionally designed to consider the unique needs of families who require lifelong support. The firm has supported 20+ families long term with 25 years of experience working with families with special needs. The service coordinates with attorneys and care planners when required, providing dedicated financial planning for families who require lifelong support."
    }
  },
  {
    "name": "Income Distribution",
    "details": {
      "service_name": "Income Distribution",
      "service_description": "Turning your accumulated wealth into a reliable, tax-efficient income stream is where strategy meets security. Sentinel designs structured withdrawal plans \\u2014 coordinated across your taxable, tax-deferred, and tax-free accounts \\u2014 to pursue steady income throughout retirement while protecting against sequence-of-returns risk and the quiet threat of outliving your assets."
    }
  },
  {
    "name": "Divorce Financial Planning",
    "details": {
      "availability": "Not specified",
      "service_name": "Divorce Financial Planning",
      "pricing_offers": "[\\n    \\"Not specified\\"\\n]",
      "service_description": "Personalized financial planning service for those going through a divorce and needing confidence in the future. The service is provided by a team well versed in the financial complexities of divorce from both a personal and professional perspective, offering tailored financial solutions to protect clients' futures during and after divorce."
    }
  },
  {
    "name": "Tax Management",
    "details": {
      "availability": "Not specified",
      "service_name": "Tax Management",
      "pricing_offers": "[\\n    \\"Not specified\\"\\n]",
      "service_description": "Comprehensive tax management service that coordinates the client's financial ecosystem, ensuring every withdrawal, sale, and investment is aligned to minimize lifetime tax liability. The service manages where assets are held and when gains are realized, including Roth conversions, tax-loss harvesting, and multi-account withdrawal sequencing. Advisors analyze taxable, tax-deferred, and tax-free 'buckets' as one cohesive plan, ensuring that income is drawn from the most efficient source each year. The service also models long-term strategies such as Qualified Charitable Distributions and tax-efficient gifting, all aligned with current IRS rules. The goal is to help clients fund their lifestyle and legacy using every advantage available under U.S. tax law so their wealth works smarter, lasts longer, and supports more of what they value."
    }
  },
  {
    "name": "Legacy Planning",
    "details": {
      "availability": "Not specified",
      "service_name": "Legacy Planning",
      "pricing_offers": "[\\n    \\"Not specified\\"\\n]",
      "service_description": "Legacy planning service that helps families articulate their values, educate their heirs, and establish guardrails that protect both the wealth and the relationships it affects. The service works with clients to design staged inheritance structures, multi-generational trusts, and educational plans that empower rather than enable. The process often begins with a pilot\\u2014a small, supervised pool of assets that allows beneficiaries to practice stewardship before full inheritance. The service addresses real-world risks like divorce, debt, and mismanagement while honoring clients' philanthropic or faith-based intentions. The service provides structures and education to preserve family wealth, values, and relationships across generations. Legacy planning is about more than control\\u2014it's about character, ensuring values continue as a living reflection of purpose, discipline, and love for those who follow."
    }
  },
  {
    "name": "Asset Management",
    "details": {
      "availability": "Not specified",
      "service_name": "Asset Management",
      "pricing_offers": "[\\n    \\"Not specified\\"\\n]",
      "service_description": "Comprehensive asset management service rooted in modern portfolio theory, refined through decades of real-world application. Building on the Nobel Prize-winning work of Harry Markowitz, the service aims to eliminate unsystematic risk through deliberate diversification, leaving only systematic risks (PRIME: Purchasing Power, Reinvestment, Interest Rate, Market, and Exchange Risk). The service constructs portfolios that are globally diversified, tax-efficient, and designed to be resilient through market cycles. Every client portfolio is guided by an Investment Policy Statement, stress-tested under different market conditions, and monitored continuously for style drift and opportunity. The service involves engineering portfolios that pursue growth while endeavoring to protect what matters most, with a focus on clarity, consistency, and composure through every season of the market. Portfolios are created using model portfolios based on a client's investment goals, income needs, tax situation, and tolerance for risk."
    }
  }
]`,
  productInformationJson: `[]`,
  paaDataJson: `[
  "What is SmartAsset management?"
]`,
};

const CLIENT_SYLUS: ClientSample = {
  id: `690aec5c-b7ce-4e76-8a33-66c67a552f59`,
  slug: `sylus`,
  name: `Sylus`,
  url: `https://www.sylus.ai/`,
  primaryLogoUrl: `https://file-host.link/website/sylus-j1ad5s/assets/logo/logo.webp`,
  sampleServiceTopic: `Data Analytics Services & Solutions`,
  sampleCategoryTopic: ``,
  sampleBlogTopic: `What Is a Periodic Report & How Is It Created?`,
  designTokensJson: `{
  "fonts": {
    "body_font_url": "https://fonts.googleapis.com/css2?family=Inter:wght@300..700&display=swap",
    "heading_font_url": "https://fonts.googleapis.com/css2?family=Urbanist:wght@300..700&display=swap"
  },
  "css_variables": {
    "--color-brand-text": "#1a1a1a",
    "--font-family-body": "Inter, ui-sans-serif, system-ui, sans-serif",
    "--color-brand-primary": "#1a1a1a",
    "--font-family-heading": "Urbanist, ui-sans-serif, system-ui, sans-serif",
    "--color-brand-secondary": "#4a4a4a",
    "--color-brand-text-muted": "#9a9a9a",
    "--color-brand-primary-dark": "#000000",
    "--color-brand-text-inverse": "#ffffff",
    "--color-brand-text-primary": "#0f0f0f",
    "--color-brand-primary-hover": "#000000",
    "--color-brand-primary-light": "rgba(26, 26, 26, 0.05)",
    "--color-brand-text-tertiary": "#6b6b6b",
    "--color-brand-primary-medium": "rgba(26, 26, 26, 0.1)",
    "--color-brand-secondary-dark": "#2d2d2d",
    "--color-brand-text-secondary": "#3a3a3a",
    "--color-brand-secondary-hover": "#333333",
    "--color-brand-secondary-light": "rgba(74, 74, 74, 0.05)",
    "--color-brand-secondary-medium": "rgba(74, 74, 74, 0.1)",
    "--color-brand-primary-foreground": "#ffffff",
    "--color-brand-secondary-foreground": "#ffffff"
  }
}`,
  companyInfoJson: `{
  "name": {
    "dba_name": null,
    "legal_name": "Sylus Labs, Inc",
    "company_name": "Sylus"
  },
  "founded": {
    "founded_date_year": null,
    "years_in_business": null
  },
  "locations": {
    "branch_locations": [],
    "headquarters_address": null
  },
  "credentials": {
    "memberships": [],
    "accreditations": [],
    "certifications": [
      "SOC 2 Type II compliant",
      "HIPAA compliant"
    ],
    "business_licenses": []
  },
  "company_size": {
    "employee_count": null,
    "annual_turnover": null
  },
  "service_team": {
    "team_members": [
      {
        "bio": null,
        "name": "Huzaifa Hameed",
        "title": null,
        "headshot_image": "https://cal.com/api/avatar/cc309414-75bf-45d1-b599-1d6fc69ec92c.png"
      }
    ],
    "employee_count": null,
    "years_of_experience": null
  },
  "company_story": {
    "milestones": [],
    "founding_story": null,
    "company_history": null,
    "growth_narrative": null
  },
  "phone_numbers": [],
  "service_areas": [],
  "email_addresses": [
    "info@sylus.ai"
  ],
  "major_customers": [
    {
      "customer_name": "OpenAI",
      "customer_logo_url": null
    }
  ],
  "target_geographies": [
    "us"
  ],
  "value_propositions": {
    "key_benefits": [
      "Get the data you need in seconds",
      "Generate entire dashboards - beautiful, modern & shareable",
      "Customize charts with plain English",
      "Verify your metrics with team collaboration",
      "Securely share content with a link, email invitation, or embedded directly into websites & products",
      "Organize everything in collections",
      "Receive alerts when there are spikes in activity"
    ],
    "market_positioning": "Enterprise-level B2B SaaS platform providing advanced AI-powered data analysis solutions with unlimited seats and governed context for modern data teams",
    "competitive_advantages": [
      "Unlimited seats & users - pricing is based on estimated usage",
      "SOC 2 Type II compliant",
      "HIPAA compliant",
      "Self-hosted deployment available",
      "Neither Sylus nor model partners train models on customer data",
      "Schedule reports & AI-generated summaries to email or Slack",
      "Query data directly from Slack"
    ],
    "unique_selling_propositions": [
      "Built on world leading AI models",
      "Connect your data sources and ask questions in plain English",
      "AI data analyst that thoroughly explores your data & validates assumptions before returning a final deliverable",
      "Built on governed context - grounds all analysis and exploration in your dbt models & dbt documentation"
    ]
  },
  "awards_recognitions": [
    "Y Combinator backed"
  ],
  "social_media_profiles": {
    "other": [],
    "yelp_url": null,
    "twitter_url": null,
    "youtube_url": null,
    "facebook_url": null,
    "linkedin_url": null,
    "whatsapp_url": null,
    "instagram_url": null
  },
  "target_customer_segments": [
    "Fast-growing startups",
    "F1000 enterprises",
    "Data teams",
    "Business users requiring data analysis"
  ],
  "mission_statement_company_values": {
    "vision": null,
    "taglines": [
      "Chat GPT, but trained on your business's data",
      "ChatGPT, but trained on your business's data",
      "AI-powered analytics for modern companies"
    ],
    "core_values": [],
    "mission_statement": null
  }
}`,
  additionalInfoJson: `{
  "business_profile": {
    "inventory_nature": "100% Software-as-a-Service (SaaS) - No physical inventory, replacement parts, or consumables",
    "business_identity": "B2B SaaS platform providing AI-powered data analytics and business intelligence tools exclusively for enterprise clients, not a product catalog or e-commerce business.",
    "primary_verticals": [
      "AI Data Analysis",
      "Business Intelligence Dashboards",
      "Data Visualization",
      "Automated Reporting",
      "Team Collaboration Tools",
      "Enterprise Data Integration"
    ],
    "explicit_out_of_scope": [
      "Physical Products",
      "Consumer/B2C Services",
      "E-commerce Transactions",
      "Product Catalog Management",
      "Inventory Sales",
      "Wholesale Distribution",
      "Retail Operations",
      "Equipment Rentals",
      "Hardware Sales",
      "Replacement Parts"
    ]
  }
}`,
  logoUrlsJson: `{
  "favicon": "https://file-host.link/website/sylus-j1ad5s/assets/logo/1773313796033048_ec3481afa37a43768ec1737e9a982f78.png",
  "primary_logo": "https://file-host.link/website/sylus-j1ad5s/assets/logo/logo.webp"
}`,
  serviceCatalogJson: `[
  {
    "name": "Real-Time Data Synchronization",
    "details": {
      "service_name": "Real-Time Data Synchronization",
      "service_description": "Continuously syncs data from connected systems to keep dashboards and visualizations updated automatically, removing the need for manual exports or data uploads."
    }
  },
  {
    "name": "AI Chart Recommendations",
    "details": {
      "service_name": "AI Chart Recommendations",
      "service_description": "Uses artificial intelligence to suggest the most appropriate chart types and visualization formats based on the structure of the dataset. This ensures clearer insights and better storytelling with data."
    }
  },
  {
    "name": "Unlimited Seats and Users",
    "details": {
      "availability": "Not specified",
      "service_name": "Unlimited Seats and Users",
      "pricing_offers": "[\\n    \\"Pricing is based on estimated usage\\",\\n    \\"Unlimited seats included\\"\\n]",
      "service_description": "The platform comes with unlimited seats for users. Multiple team members can access and collaborate on the platform simultaneously. Pricing is based on estimated usage rather than per-seat pricing."
    }
  },
  {
    "name": "Collections and Organization",
    "details": {
      "availability": "Not specified",
      "service_name": "Collections and Organization",
      "pricing_offers": "[\\n    \\"Not specified\\"\\n]",
      "service_description": "Users can organize everything in collections that are flexible and built for privacy. Collections can be created for different purposes such as 'KPIs for the Board', 'Approved Product Assets', 'Sales Assets for Upper Management', and 'Company KPIs'. Collections can contain multiple reports, dashboards, and assets, with indicators showing the number of items (e.g., '+11 more'). Collections can be marked as 'Verified'. Workspaces can contain multiple collections and reports organized by teams."
    }
  },
  {
    "name": "Automated Dashboard Generation",
    "details": {
      "service_name": "Automated Dashboard Generation",
      "service_description": "Automatically converts connected data sources into interactive dashboards. The system structures and organizes data visuals so teams can monitor metrics and trends without building dashboards manually."
    }
  },
  {
    "name": "Content Sharing and Publishing",
    "details": {
      "availability": "Not specified",
      "service_name": "Content Sharing and Publishing",
      "pricing_offers": "[\\n    \\"Not specified\\"\\n]",
      "service_description": "Users can securely share content with a link, email invitation, or embedded directly into websites and products. The platform allows sharing with anyone and includes flexible privacy controls. Users can invite others by email with different permission levels including 'Full access' and 'Can view'. Data can be exported as CSVs or PDFs. Content can be published and embedded in various formats."
    }
  },
  {
    "name": "Metric Verification and Collaboration",
    "details": {
      "availability": "Not specified",
      "service_name": "Metric Verification and Collaboration",
      "pricing_offers": "[\\n    \\"Not specified\\"\\n]",
      "service_description": "Users can request verification of reports if unsure about correctness. The platform allows users to easily request someone on their team to review and verify reports. Teams can collaborate in real-time with comments and multiplayer functionality. Verification status tracking includes stages: Not requested, Requested, In Review, Verified, and Backlogged."
    }
  },
  {
    "name": "Data Visualization and Chart Customization",
    "details": {
      "availability": "Not specified",
      "service_name": "Data Visualization and Chart Customization",
      "pricing_offers": "[\\n    \\"Not specified\\"\\n]",
      "service_description": "Users can customize charts with plain English commands to get exact styling they want. The platform allows users to ask questions and receive back data in the form of bar charts, line graphs, and other visualizations. Charts can be customized with natural language requests, such as making them 'Christmas-y' themed. The service includes auto-selection of appropriate chart types and the ability to modify visualizations based on user preferences."
    }
  },
  {
    "name": "Data Source Connectivity",
    "details": {
      "availability": "Not specified",
      "service_name": "Data Source Connectivity",
      "pricing_offers": "[\\n    \\"Not specified\\"\\n]",
      "service_description": "The platform allows users to connect their data sources and ask questions in plain English. Users can connect datasources using 500+ 1-click integrations. The service is built on governed context and grounds all analysis and exploration in dbt models and dbt documentation. The platform supports multiple data source integrations as indicated by various integration logos displayed.\\n\\nTypical integration categories include:\\n1. ERP systems\\n2. Accounting & finance platforms\\n3. POS systems\\n4. Databases\\n5. E-commerce tools\\n6. CRM & sales systems\\n7. Spreadsheets\\n8. Developer tools and productivity platforms"
    }
  },
  {
    "name": "Dashboard and Report Generation",
    "details": {
      "availability": "Not specified",
      "service_name": "Dashboard and Report Generation",
      "pricing_offers": "[\\n    \\"Not specified\\"\\n]",
      "service_description": "The platform can generate entire dashboards that are beautiful, modern, and shareable. Users can build comprehensive KPI dashboards showing key metrics, such as total revenue, average order value, monthly revenue and order volume, and other business metrics. Dashboards display multiple key metrics to give users an overview of their business performance. Reports can be created for various purposes including sales rep performance analysis, new feature reports, and company KPIs. The AI reasons through data for minutes before presenting final dashboards with insights and key findings."
    }
  }
]`,
  productInformationJson: `[]`,
  paaDataJson: `[
  "What is a data analytics company?"
]`,
};

const CLIENT_TERRAPIN_INDUSTRIAL_LLC: ClientSample = {
  id: `d005eb68-3032-4b3f-8204-83efa5ff431a`,
  slug: `terrapin-industrial-llc`,
  name: `Terrapin Industrial LLC`,
  url: `https://terrapin-industrial.com/`,
  primaryLogoUrl: `https://file-host.link/website/terrapin-industrial-89rx2t/assets/uploaded-assets/1773168508592000_2bcffd5b66d24183b87be8e838beea0b`,
  sampleServiceTopic: ``,
  sampleCategoryTopic: `Steam Protected Instrument Enclosures for Industrial Applications`,
  sampleBlogTopic: `Top 10 Industrial Instrument Enclosure Manufacturers In Pennsylvania`,
  designTokensJson: `{
  "fonts": {
    "body_font_url": "https://fonts.googleapis.com/css2?family=Inter:wght@300..700&display=swap",
    "heading_font_url": "https://fonts.googleapis.com/css2?family=Urbanist:wght@300..700&display=swap"
  },
  "css_variables": {
    "--color-brand-text": "#1A1F3A",
    "--font-family-body": "Inter, ui-sans-serif, system-ui, sans-serif",
    "--color-brand-primary": "#303C9C",
    "--font-family-heading": "Urbanist, ui-sans-serif, system-ui, sans-serif",
    "--color-brand-secondary": "#35CDFE",
    "--color-brand-text-muted": "#9CA3BE",
    "--color-brand-primary-dark": "#1F2665",
    "--color-brand-text-inverse": "#ffffff",
    "--color-brand-text-primary": "#1A1F3A",
    "--color-brand-primary-hover": "#252E7A",
    "--color-brand-primary-light": "rgba(48, 60, 156, 0.05)",
    "--color-brand-text-tertiary": "#6B7497",
    "--color-brand-primary-medium": "rgba(48, 60, 156, 0.1)",
    "--color-brand-secondary-dark": "#0DA3D4",
    "--color-brand-text-secondary": "#4A5578",
    "--color-brand-secondary-hover": "#1FB8E8",
    "--color-brand-secondary-light": "rgba(53, 205, 254, 0.05)",
    "--color-brand-secondary-medium": "rgba(53, 205, 254, 0.1)",
    "--color-brand-primary-foreground": "#ffffff",
    "--color-brand-secondary-foreground": "#ffffff"
  }
}`,
  companyInfoJson: `{
  "name": {
    "dba_name": null,
    "legal_name": null,
    "company_name": "Terrapin Industrial"
  },
  "founded": {
    "founded_date_year": null,
    "years_in_business": null
  },
  "locations": {
    "branch_locations": [],
    "headquarters_address": "18062 N Brazosport Blvd, Richwood TX 77531"
  },
  "credentials": {
    "memberships": [],
    "accreditations": [],
    "certifications": [
      "IP 66 Protection Standard (Retrofittable Enclosure)",
      "IP 65 Protection Standard (Expandable Enclosure)"
    ],
    "business_licenses": []
  },
  "company_size": {
    "employee_count": null,
    "annual_turnover": null
  },
  "service_team": {
    "team_members": [
      {
        "bio": null,
        "name": "Brad Faseler",
        "title": "CEO Founder",
        "headshot_image": null
      },
      {
        "bio": null,
        "name": "Jim Bundschuh",
        "title": "Board Member",
        "headshot_image": null
      },
      {
        "bio": null,
        "name": "Jerry Dearing",
        "title": "Board Member",
        "headshot_image": null
      },
      {
        "bio": null,
        "name": "Eric Anderson",
        "title": "Board Member",
        "headshot_image": null
      },
      {
        "bio": null,
        "name": "David Anderson",
        "title": "Board Member",
        "headshot_image": null
      }
    ],
    "employee_count": 5,
    "years_of_experience": null
  },
  "company_story": {
    "milestones": [],
    "founding_story": "The company was founded by industry professionals whose field experience identified the need for an innovative solution to address the challenges of rigid enclosure installation and replacement, particularly the requirement to take instruments offline and the delays caused by offsite integration.",
    "company_history": "Terrapin is led by industry professionals with boots on the ground experience in the industry, which led Terrapin's team to create an innovative solution for flexible installation and decommissioning of instrument enclosures.",
    "growth_narrative": "Terrapin developed from industry professionals recognizing inefficiencies in traditional rigid enclosure installations and creating patented modular solutions to address these challenges, focusing on reducing installation complexity and eliminating supply chain delays."
  },
  "phone_numbers": [
    "(281)-615-1429",
    "(210)-219-2821"
  ],
  "service_areas": [
    "United States",
    "Canada"
  ],
  "email_addresses": [],
  "major_customers": [],
  "ratings_reviews": {
    "GBP": {
      "rating": null,
      "review_count": null
    }
  },
  "business_category": [
    "Manufacturer"
  ],
  "target_geographies": [
    "us"
  ],
  "value_propositions": {
    "key_benefits": [
      "60% faster heater installation in under 2 minutes",
      "Reduces total installation cost by 30%",
      "Reduces schedule delays",
      "Greater access to instrument and tubing during installation",
      "Simplified maintenance with removable components",
      "Maintains >75°F/23.9°C in -60°F/-51.1°C temperature environment with heated liner",
      "Exceptional heat output ranges from 108 watts to 720 watts depending on heater cable selection",
      "Allows for installation in hazardous areas - heated liner can be used in T6 areas"
    ],
    "market_positioning": "The innovative provider of modular, retrofittable instrument enclosures that reduce installation time and costs by 30% through patented quick-connect designs",
    "competitive_advantages": [
      "Eliminates need for offsite integration and schedule breaks",
      "Reduces total install time and cost by 30%",
      "Parts can be individually replaced",
      "Can be installed all at once or in stages",
      "Allows instruments and bundle to be installed ahead of the enclosure",
      "Enclosure can be installed before or after the instrument and tubing bundle",
      "Eliminates finned heaters, GUAT and rigid conduit for more spacious enclosure interior",
      "Heater cable has 30-year life expectancy versus 5 years for classic finned and block style heaters"
    ],
    "unique_selling_propositions": [
      "Patented ThermaGuard modular design that allows enclosures to be installed piecemeal around existing instruments without taking them offline",
      "Pre-engineered holes for power wiring, control wiring, and process tubes for standardized installation",
      "Quick connect system with integrated pipe stand bracket for easy enclosure removal",
      "Self-aligning manifold design with integrated bundle, power wire, and control wire entries",
      "Patent-pending heated enclosure liner with heater cable rated for 30-year life expectancy",
      "Retrofittable design allows for enclosure replacement without taking the instrument offline"
    ]
  },
  "awards_recognitions": [],
  "social_media_profiles": {
    "other": [],
    "yelp_url": null,
    "twitter_url": null,
    "youtube_url": "https://www.youtube.com/channel/UCMcl995wKpkkCn-kI-YjzTQ",
    "facebook_url": null,
    "linkedin_url": null,
    "whatsapp_url": null,
    "instagram_url": null
  },
  "target_customer_segments": [
    "Industrial facilities requiring instrument enclosures",
    "Oil and gas industry",
    "Process industries requiring winterization solutions",
    "Facilities with hazardous area classifications",
    "Power generation industry",
    "Petrochemical industry",
    "mining and metal industry",
    "Marine & Offshore industry",
    "Chemical Manufacturing"
  ],
  "mission_statement_company_values": {
    "vision": null,
    "taglines": [
      "Innovative Modular Enclosures for Flexible Industrial Installations"
    ],
    "core_values": [
      "Quick response and expert consulting skill to assist customers in making the right decisions for the job"
    ],
    "mission_statement": null
  }
}`,
  additionalInfoJson: `{
  "business_profile": {
    "inventory_nature": "100% Whole Units and Component Systems - Pre-engineered modular enclosure systems, heating elements, insulation kits, and mounting hardware sold as complete units or integrated assemblies for field installation",
    "business_identity": "B2B manufacturer of modular instrument enclosures and winterization systems for industrial process instrumentation, specializing in retrofittable/expandable enclosure designs, heated liners, and thermal protection accessories.",
    "primary_verticals": [
      "Instrument Enclosures (Retrofittable & Expandable)",
      "Heating Systems (Finned Heaters, Heated Liners, Steam Heaters, Rigid Heated Blankets)",
      "Insulation Products (Urethane, Pyrogel)",
      "Mounting Hardware (Pipe Stands, Brackets)",
      "Winterization Accessories (Thermostats, Gaskets, Entry Seals)"
    ],
    "explicit_out_of_scope": [
      "Instrumentation devices (transmitters, sensors, gauges)",
      "Process tubing/piping materials",
      "Electrical conduit or wiring",
      "Valve bodies or actuators",
      "Coriolis meters or flow measurement devices",
      "Installation labor services",
      "Offsite integration services",
      "Used or refurbished enclosures",
      "Rental equipment",
      "Residential or consumer products",
      "HVAC systems",
      "Building enclosures or structures"
    ]
  }
}`,
  logoUrlsJson: `{
  "favicon": "https://file-host.link/website/terrapin-industrial-89rx2t/assets/logo/1771419742363785_27054345ff6e4b1c833c0ccd0eeee430.html",
  "primary_logo": "https://file-host.link/website/terrapin-industrial-89rx2t/assets/uploaded-assets/1773168508592000_2bcffd5b66d24183b87be8e838beea0b"
}`,
  serviceCatalogJson: `[
  {
    "name": "ThermaGuard Retrofittable Enclosures",
    "details": {
      "availability": "Not specified",
      "service_name": "ThermaGuard Retrofittable Enclosures",
      "pricing_offers": "[\\n    \\"Not specified\\"\\n]",
      "service_description": "Patented modular instrument enclosure design that significantly simplifies installations with a retrofittable approach. Enclosures can be installed as pre-assembled units or piecemeal around existing instruments without taking them offline. Features self-aligning manifold design with pre-engineered holes for power wiring, control wiring, and process tubes for complete field installation including process tubing, electrical, block heaters, calibration and testing without need for offsite integration. Outer dimensions: 23.58\\" x 18.75\\" x 23.61\\" (59.89cm x 47.62cm x 59.96cm). Inner dimensions: 21.95\\" x 17.92\\" x 23.08\\" (55.75cm x 45.51cm x 58.62cm). Made from ASA Plastic with glass reinforcement, approximately \\u00bc\\" (0.635cm) thickness. IP 66 protection standard. Temperature rating: >75\\u00b0F/23.9\\u00b0C in -60\\u00b0F/-51.1\\u00b0C environment when used with ThermaGuard Heated Liner. Features EPDM gaskets, light grey color, approximate weight 19.4 lbs (8.8 Kg). Includes stainless steel lid support, two stainless steel hinges, two stainless steel latches, and all stainless steel hardware. Mounts to sch 40 2\\" pipe diameter (2.375\\") or sch 40 5.08cm pipe diameter (6.03cm). Allows instruments and bundle to be installed ahead of enclosure, can be installed before or after instrument and tubing bundle, parts can be individually replaced, can be installed all at once or in stages. Optional removable insulation available in 1\\"(2.54cm) Urethane or 10-20mm Pyrogel. Accessories available include 100W heater with mounting bracket, thermostat with preset temperatures, 2\\" (5.08cm) instrument stand in single configuration, pipe stands in hot-dip galvanized, painted galvanized, or fiberglass, and universal mounting bracket for single or dual instrument installations. Quick connect system simplifies installation with integrated pipe stand bracket allowing easy enclosure removal without disrupting instrument operation. Estimated to reduce total installation cost by 30% below current market offerings."
    }
  },
  {
    "name": "ThermaGuard Rigid Heated Blanket",
    "details": {
      "availability": "Not specified",
      "service_name": "ThermaGuard Rigid Heated Blanket",
      "pricing_offers": "[\\n    \\"Not specified\\"\\n]",
      "service_description": "Hard framed heated liner and insulated blanket for valve, Coriolis meter and other applications. Patent-pending heated blanket solution with rigid conductive metal liner allowing self-regulating heater cables to be installed onto the liner. Removes heater cable from process piping or instrument manifold while providing up to 200 watts of heat without self-regulating cable being exposed to over-temperature process temps. Can be installed onto pipe stand for instrument protection applications or hang from process piping or tubing for root valve (primary isolation valve) applications. Suitable for isolation valve, instrument, and Coriolis meter applications. Cable options: 120 VAC, 208 VAC, 240 VAC, 277 VAC (Self-regulating or MI Cable). Rigid liner material: Aluminum. Blanket type: Sewn seam constructions with Velcro and straps for installation on rigid liner. No requirement for High Temp mineral insulated cable at root valve. Easy mounting options using L Bracket for instrument applications and hanging brackets for root valve applications. Heater cables can be matched with pre-insulated tubing bundle for simplicity of installation and maintenance. ThermaGuard Soft pack heater can be easily placed to the side, freeing up instrument technician to work on isolation valve or instrument with no heater cable obstructing process tubing/piping or instrument manifold. Bottom section allows for 12 ft of heater cable to be installed on conductive liner. For battery applications, uses 12V or 24V heater cables to keep battery within temperature range for safe discharge or recharge. Mounted with 2 adjustable hanging brackets for root valve applications or with simple L-bracket and U-bolts for instrument applications."
    }
  },
  {
    "name": "ThermaGuard Heated Enclosure Liner",
    "details": {
      "availability": "Not specified",
      "service_name": "ThermaGuard Heated Enclosure Liner",
      "pricing_offers": "[\\n    \\"Not specified\\"\\n]",
      "service_description": "Patent-pending heated enclosure liner providing ultimate freeze protection for enclosures. Design incorporates insulation and heater cable with 30-year life expectancy. Insulation is removable at any time with easy 2-piece design. Cable options: 3 Watts to 20 Watts. Insulation options: Molded urethane 1\\" or 3/8\\", also available in Pyrogel, mineral wool, or fiberglass temp mat. Features aluminum liner matrix. Inner liner material: ABS up to 200\\u00b0F/93.3\\u00b0C or PolyCarbonate up to 275\\u00b0F/135\\u00b0C. Eliminates finned heaters, GUAT and rigid conduit for more spacious enclosure interior and greater access to instrument and process tubing. Exceptional heat output ranges from 108 watts with 3watt/ft heater cable up to 720 watts with 20watt/ft heater cable for extreme temperature environments. Allows for installation in hazardous areas the insulation heater cable is rated for, can be used in T6 areas whereas finned and block heaters are typically limited to T3 (392\\u00b0F). Heater cable entry for liner is integrated into pipe stand for seamless installation and operation."
    }
  },
  {
    "name": "ThermaGuard Expandable Enclosures",
    "details": {
      "availability": "Not specified",
      "service_name": "ThermaGuard Expandable Enclosures",
      "pricing_offers": "[\\n    \\"Not specified\\"\\n]",
      "service_description": "Customizable and expandable enclosure system for single, double, or triple instrument configurations. Patented design makes installation simplified and versatile for multiple instrument configurations. Can be installed as pre-assembled fully integrated system. Features customizable entry ports that can be punched into replaceable back plate in the field. Outer dimensions: 23.58\\" x 18.75\\" x 23.61\\" (59.89cm x 47.62cm x 59.96cm). Inner dimensions: 21.95\\" x 17.92\\" x 23.08\\" (55.75cm x 45.51cm x 58.62cm). Material thickness approximately \\u00bc\\" (0.635cm). Made from GRP (glass reinforced polyester). IP 65 protection standard. Temperature rating: >75\\u00b0F/23.9\\u00b0C in -60\\u00b0F/-51.1\\u00b0C environment with ThermaGuard Heated Liner. EPDM gasket material, light grey color. Approximate weight: Single 50lbs (22.68kg), Double 75lbs (34kg), Triple 130lbs (59kg). Mounts to sch 40 2\\" pipe diameter (2.375\\") or sch 40 5.08cm pipe diameter (6.03cm). Includes stainless steel lid support, two stainless steel hinges, two stainless steel latches, and all stainless steel hardware. Features gland plates for custom holes for tubing, piping and other process penetrations, with all penetrations sealed with entry seals and cold shrink caps. Class 1 division 2 thermo-electric coolers can be easily bolted on as plug and play. Parts can be individually replaced, can be installed all at once or in stages. Optional heated liner available to maintain internal temperatures. Optional removable insulation in 1\\"(2.54cm) urethane or 10-20mm Pyrogel. Accessories include 1\\"(2.54cm) Urethane or 10-20mm Pyrogel Insulation, 100W heater with mounting bracket, thermostat with preset temperatures, ThermaGuard Expandable baseplates in single, double or triple configuration, pipe stands in hot-dip galvanized, painted galvanized, or fiberglass, and universal mounting bracket for single or dual instrument installations. Removable insulation with K Factor of .159 BTU (IT) inch/hour/foot\\u00b2/Fahrenheit can maintain up to >75\\u00b0F/23.9\\u00b0C in -50\\u00b0F/-45.5\\u00b0C temperatures with arctic insulation and Terrapin heater."
    }
  },
  {
    "name": "ThermaGuard 100W Finned Heater",
    "details": {
      "availability": "Not specified",
      "service_name": "ThermaGuard 100W Finned Heater",
      "pricing_offers": "[\\n    \\"Not specified\\"\\n]",
      "service_description": "Compact and efficient finned heater design for enclosures. Easy install mounting bracket allows for 360\\u00b0 heater mounting for maximum flexibility during installation. Patented mounting clip allows for both vertical and horizontal heater orientations. Maintains 40\\u00b0F(4.4\\u00b0C) in -60\\u00b0F(-51.1\\u00b0C). 60% faster heater installation in under 2 minutes. 360\\u00b0 universal mounting bracket for single or dual instrument installations. Heater can be mounted or removed at any time. Compact and efficient design for easier installation and instrument access. Dimensions: 3\\" x 6.18\\" x 4.13\\" (7.62cm x 15.69cm x 10.49cm). Voltage: 120V, 208V-277V. Amps: 0.83A. Material type: Marine Grade Aluminum. Finish: Black Anodized. Temp rating with insulation: 40\\u00b0F/4.4\\u00b0C in -60\\u00b0F/-51.1\\u00b0C environment. Patented heater mounting bracket dimensions: 2.08\\" x 4.38\\" x 5.80\\" (5.28cm x 11.12cm x 14.73cm). Mounting bracket material: Marine Grade Aluminum with Black Anodized finish."
    }
  },
  {
    "name": "ThermaGuard Steam Heater",
    "details": {
      "availability": "Not specified",
      "service_name": "ThermaGuard Steam Heater",
      "pricing_offers": "[\\n    \\"Not specified\\"\\n]",
      "service_description": "Efficient enclosure heating solution for steam applications. Provides 100 Watts at 50psi (300F) assuming 50F freeze protection in the enclosure. Tube type options: 304 or 316 Stainless Steel. Tube outer diameter: 3/8\\" OD. Tube thickness: 0.028\\"."
    }
  },
  {
    "name": "Pipe Stands",
    "details": {
      "availability": "Not specified",
      "service_name": "Pipe Stands",
      "pricing_offers": "[\\n    \\"Not specified\\"\\n]",
      "service_description": "Complete set of materials for enclosure installations. Height: 54\\" (137.16cm). Base dimensions: 10\\" x 10\\" (25.4cm x 25.4cm). Material thickness: Sch 40 (0.154\\") (0.391cm). Material type options: HDG (Hot-Dip Galvanized), Painted Galvanized, or Fiberglass."
    }
  },
  {
    "name": "Sales and Customer Support",
    "details": {
      "availability": "Not specified",
      "service_name": "Sales and Customer Support",
      "pricing_offers": "[\\n    \\"Not specified\\"\\n]",
      "service_description": "Terrapin maintains detailed downloadable guides, data sheets, specifications, assembly instructions, and marketing materials for customers. Documentation is an important aspect to serving and supporting customers. Sales team available to assist customers who need assistance or are unable to find information they are seeking. Contact available via phone at (281)-615-1429 or (210)-219-2821. Quick response and expert consulting skill to assist customers in making right decisions for the job."
    }
  },
  {
    "name": "ThermaGuard Insulation",
    "details": {
      "availability": "Not specified",
      "service_name": "ThermaGuard Insulation",
      "pricing_offers": "[\\n    \\"Not specified\\"\\n]",
      "service_description": "Removable insulation that can be easily replaced, removed or installed at any time without removing enclosure or process instrument. Lightweight insulation highly efficient with K-Factor of .159 BTU (IT) inch/hour/foot\\u00b2/Fahrenheit. Outer dimensions: 21.95\\" x 17.92\\" x 23.08\\" (55.75cm x 45.52cm x 58.62cm). Material and thickness options: 1\\" (2.54cm) Urethane or 10mm or 20mm Pyrogel. Short term exposure temp resistance: 320\\u00b0F (160\\u00b0C). Long term exposure temp resistance: 212\\u00b0F (100\\u00b0C). Grey color. Optional liner material: PET. Optional liner color: Grey. Optional liner thickness: 2mm."
    }
  }
]`,
  productInformationJson: `[
  {
    "name": "ThermaGuard Heated Soft Pak - Rigid Heated Blanket Liner",
    "details": {
      "image_id": "refined-images/1771421553979671_6510bb3e581e4bbc8942b0bdca0a6c6b",
      "filter_data": {
        "Heat Source": [
          "Electric (AC)"
        ],
        "Product Type": [
          "Heater"
        ],
        "Primary Material": [
          "Aluminum"
        ],
        "Protection & Safety Rating": [
          "No Specific Rating"
        ]
      },
      "product_key": "https://terrapin-industrial.com/rigid-heated-blanket/",
      "manufacturer": "Terrapin Industrial",
      "product_name": "ThermaGuard Heated Soft Pak - Rigid Heated Blanket Liner",
      "product_media": [
        {
          "url": "https://file-host.link/website/terrapin-industrial-89rx2t/assets/refined-images/1771421553979671_6510bb3e581e4bbc8942b0bdca0a6c6b/1080.webp"
        }
      ],
      "support_service": [
        "Installation Guide Available",
        "Technical Support"
      ],
      "served_locations": [
        "USA",
        "Canada"
      ],
      "shipping_returns": "Shipping and return details available upon request. Product includes standard manufacturer warranty coverage.",
      "key_features_usps": [
        "Patent-pending heated blanket solution with rigid conductive metal liner that removes heater cable from process piping",
        "Provides up to 200 watts of heat without self-regulating cable exposure to over-temperature process temps",
        "No requirement for High Temp mineral insulated cable at root valve applications",
        "Heater can be easily placed to the side, freeing up technicians to work on isolation valve or instrument without obstruction",
        "12 ft of heater cable capacity on conductive liner provides considerably more heating than direct installation on tubing or piping"
      ],
      "ownership_options": [
        "Purchase"
      ],
      "product_identifier": "ThermaGuard Heated Soft Pak",
      "pricing_information": "Pricing Available on Request",
      "applications_use_cases": [
        "Root valve (primary isolation valve) applications for process piping or tubing",
        "Instrument protection applications installed on pipe stands",
        "Winterization protection for industrial instrumentation",
        "Coriolis meter heating applications",
        "Battery temperature management (12V or 24V applications) to maintain safe discharge or recharge temperature range"
      ],
      "regulatory_information": [
        "Self-regulating cables engineered to stay below T rating (auto-ignition temperature) for hazardous area compliance"
      ],
      "associate_certifications": [],
      "technical_specifications": {
        "Heat Output": "Up to 200 watts",
        "Blanket Type": "Sewn seam constructions with Velcro and straps for installation on rigid liner",
        "Cable Options": "120 VAC, 208 VAC, 240 VAC, 277 VAC (Self-regulating or MI Cable)",
        "Mounting Options": "L Bracket for Instrument applications, hanging brackets for root valve applications",
        "Rigid Liner Material": "Aluminum",
        "Cable Length Capacity": "12 ft of heater cable on conductive liner",
        "Battery Application Voltage": "12 V or 24 V heater cables"
      }
    }
  },
  {
    "name": "ThermaGuard Steam Heater",
    "details": {
      "image_id": "refined-images/1771421550176638_d4fe9ecfc8874d59bfd841744230c18f",
      "filter_data": {
        "Heat Source": [
          "Steam"
        ],
        "Product Type": [
          "Heater"
        ],
        "Primary Material": [
          "Stainless Steel"
        ],
        "Protection & Safety Rating": [
          "No Specific Rating"
        ]
      },
      "product_key": "https://terrapin-industrial.com/thermaguard-steam-heater/",
      "manufacturer": "Terrapin Industrial",
      "product_name": "ThermaGuard Steam Heater",
      "product_media": [
        {
          "url": "https://file-host.link/website/terrapin-industrial-89rx2t/assets/refined-images/1771421550176638_d4fe9ecfc8874d59bfd841744230c18f/1080.webp"
        }
      ],
      "support_service": null,
      "served_locations": [
        "USA",
        "Canada"
      ],
      "shipping_returns": "Shipping and return information available upon request.",
      "key_features_usps": [
        "Efficient enclosure heating solution for steam applications",
        "Provides 100 Watts at 50 psi and 300\\u00b0F operating conditions",
        "Available in 304 or 316 stainless steel tube options for durability and corrosion resistance",
        "Designed for 50\\u00b0F freeze protection in enclosures"
      ],
      "ownership_options": [
        "Purchase"
      ],
      "product_identifier": null,
      "pricing_information": "Pricing Available on Request",
      "applications_use_cases": [
        "Enclosure heating in industrial steam applications",
        "Freeze protection for equipment enclosures in cold environments",
        "Industrial process heating where steam is the primary heat source"
      ],
      "regulatory_information": null,
      "associate_certifications": null,
      "technical_specifications": {
        "Power Output": "100 Watts",
        "Tube Thickness": "0.028 inch",
        "Operating Pressure": "50 psi",
        "Tube Outer Diameter": "3/8 inch OD",
        "Operating Temperature": "300\\u00b0F",
        "Tube Material Options": "304 or 316 Stainless Steel",
        "Freeze Protection Temperature": "50\\u00b0F"
      }
    }
  },
  {
    "name": "ThermaGuard 100W Finned Heater",
    "details": {
      "image_id": "refined-images/1771421552579868_6f47007a7a4a4de8a3b3e1db80bfb2e2",
      "filter_data": {
        "Heat Source": [
          "Electric (AC)"
        ],
        "Product Type": [
          "Heater"
        ],
        "Primary Material": [
          "Aluminum"
        ],
        "Protection & Safety Rating": [
          "No Specific Rating"
        ]
      },
      "product_key": "https://terrapin-industrial.com/heaters/",
      "manufacturer": "Terrapin Industrial",
      "product_name": "ThermaGuard 100W Finned Heater",
      "product_media": [
        {
          "url": "https://file-host.link/website/terrapin-industrial-89rx2t/assets/refined-images/1771421552579868_6f47007a7a4a4de8a3b3e1db80bfb2e2/1080.webp"
        }
      ],
      "support_service": [
        "Technical Support",
        "Installation Documentation Available"
      ],
      "served_locations": [
        "USA",
        "Canada"
      ],
      "shipping_returns": "Shipping and return information not specified. Contact manufacturer for details.",
      "key_features_usps": [
        "Maintains 40\\u00b0F (4.4\\u00b0C) in extreme -60\\u00b0F (-51.1\\u00b0C) environments",
        "60% faster heater installation in under 2 minutes",
        "360\\u00b0 universal mounting bracket with patented clip for vertical or horizontal orientation",
        "Compact and efficient finned design for easier installation and instrument access",
        "Marine Grade Aluminum construction with black anodized finish for durability"
      ],
      "ownership_options": [
        "Purchase"
      ],
      "product_identifier": "ThermaGuard 100W",
      "pricing_information": "Pricing Available on Request",
      "applications_use_cases": [
        "Enclosure heating for industrial instrumentation",
        "Temperature maintenance in extreme cold environments",
        "Single or dual instrument installations",
        "Outdoor equipment protection in harsh weather conditions",
        "Industrial process control enclosures"
      ],
      "regulatory_information": null,
      "associate_certifications": null,
      "technical_specifications": {
        "Amps": "0.83A",
        "Power": "100W",
        "Finish": "Black Anodized",
        "Voltage": "120V, 208V-277V",
        "Dimensions": "3\\" x 6.18\\" x 4.13\\" (7.62cm x 15.69cm x 10.49cm)",
        "Material Type": "Marine Grade Aluminum",
        "Temperature Rating": "Maintains 40\\u00b0F (4.4\\u00b0C) in -60\\u00b0F (-51.1\\u00b0C) environment with insulation",
        "Mounting Orientation": "360\\u00b0 universal mounting, vertical or horizontal",
        "Mounting Bracket Material": "Marine Grade Aluminum",
        "Mounting Bracket Dimensions": "2.08\\" x 4.38\\" x 5.80\\" (5.28cm x 11.12cm x 14.73cm)"
      }
    }
  },
  {
    "name": "Pipe Stands",
    "details": {
      "image_id": "refined-images/1771421549745045_f832d8b865104b17b5c753789624ea9d",
      "filter_data": {
        "Heat Source": [
          "No Heating Element"
        ],
        "Product Type": [
          "Structural Support"
        ],
        "Primary Material": [
          "Galvanized Steel / Fiberglass"
        ],
        "Protection & Safety Rating": [
          "No Specific Rating"
        ]
      },
      "product_key": "https://terrapin-industrial.com/pipe-stands/",
      "manufacturer": "Terrapin Industrial",
      "product_name": "Pipe Stands",
      "product_media": [
        {
          "url": "https://file-host.link/website/terrapin-industrial-89rx2t/assets/refined-images/1771421549745045_f832d8b865104b17b5c753789624ea9d/1080.webp"
        }
      ],
      "support_service": [
        "Technical specifications documentation available",
        "Spec sheet download available"
      ],
      "served_locations": [
        "USA",
        "Canada"
      ],
      "shipping_returns": "Shipping and return information available upon request. Contact manufacturer for details.",
      "key_features_usps": [
        "Available in hot-dip galvanized, painted galvanized, or fiberglass material options",
        "Schedule 40 pipe construction for durability and strength",
        "54-inch height ideal for enclosure installations",
        "10x10 inch stable base dimensions for secure mounting"
      ],
      "ownership_options": [
        "Purchase"
      ],
      "product_identifier": "FAS001",
      "pricing_information": "Pricing Available on Request",
      "applications_use_cases": [
        "Enclosure installations",
        "Industrial pipe support applications",
        "Equipment mounting and elevation",
        "Outdoor industrial installations requiring corrosion resistance"
      ],
      "regulatory_information": [],
      "associate_certifications": [],
      "technical_specifications": {
        "Height": "54 inches (137.16 cm)",
        "Material Thickness": "Schedule 40 (0.154 inches / 0.391 cm)",
        "Material Type Options": "Hot-Dip Galvanized (HDG), Painted Galvanized, Fiberglass",
        "Base Dimensions (W x L)": "10 inches x 10 inches (25.4 cm x 25.4 cm)"
      }
    }
  },
  {
    "name": "ThermaGuard Insulation",
    "details": {
      "image_id": "refined-images/1771421584067102_937c7a69e81c4f95ae9077a4473adc4b",
      "filter_data": {
        "Heat Source": [
          "No Heating Element"
        ],
        "Product Type": [
          "Insulation"
        ],
        "Primary Material": [
          "Urethane / Pyrogel"
        ],
        "Protection & Safety Rating": [
          "No Specific Rating"
        ]
      },
      "product_key": "https://terrapin-industrial.com/insulation/",
      "manufacturer": "Terrapin Industrial",
      "product_name": "ThermaGuard Insulation",
      "product_media": [
        {
          "url": "https://file-host.link/website/terrapin-industrial-89rx2t/assets/refined-images/1771421584067102_937c7a69e81c4f95ae9077a4473adc4b/1080.webp"
        }
      ],
      "support_service": [
        "Technical Support",
        "Specification Sheet Available"
      ],
      "served_locations": [
        "USA",
        "Canada"
      ],
      "shipping_returns": "Shipping and return information available upon request.",
      "key_features_usps": [
        "Easily replaced, removed, or installed without removing enclosure or process instrument",
        "Lightweight construction with high thermal efficiency (K-Factor of .159)",
        "Available in multiple material options: 1\\" Urethane or 10-20mm Pyrogel",
        "Optional PET liner for smooth protective finish",
        "Temperature resistant up to 320\\u00b0F short-term and 212\\u00b0F long-term"
      ],
      "ownership_options": [
        "Purchase"
      ],
      "product_identifier": null,
      "pricing_information": "Pricing Available on Request",
      "applications_use_cases": [
        "Thermal insulation for process instruments and industrial enclosures",
        "Industrial equipment temperature management and energy efficiency",
        "Applications requiring removable and reinstallable insulation solutions",
        "High-temperature industrial environments requiring thermal protection"
      ],
      "regulatory_information": null,
      "associate_certifications": null,
      "technical_specifications": {
        "Color": "Grey",
        "K-Factor": ".159 BTU (IT) inch/hour/foot\\u00b2/Fahrenheit",
        "Material Options": "1\\" (2.54cm) Urethane or 10mm/20mm Pyrogel",
        "Outer Dimensions": "21.95\\" x 17.92\\" x 23.08\\" (55.75cm x 45.52cm x 58.62cm)",
        "Optional Liner Color": "Grey",
        "Optional Liner Material": "PET",
        "Optional Liner Thickness": "2mm",
        "Long Term Exposure Temperature Resistance": "212\\u00b0F (100\\u00b0C)",
        "Short Term Exposure Temperature Resistance": "320\\u00b0F (160\\u00b0C)"
      }
    }
  },
  {
    "name": "ThermaGuard Expandable Enclosures",
    "details": {
      "image_id": "refined-images/1771421557348899_98b89210ab1a4adb94086f27090179a6",
      "filter_data": {
        "Heat Source": [
          "No Heating Element"
        ],
        "Product Type": [
          "Enclosure"
        ],
        "Primary Material": [
          "GRP (Glass Reinforced Polyester)"
        ],
        "Protection & Safety Rating": [
          "IP65",
          "Class 1 Division 2"
        ]
      },
      "product_key": "https://terrapin-industrial.com/expandable-enclosures/",
      "manufacturer": "Terrapin Industrial",
      "product_name": "ThermaGuard Expandable Enclosures",
      "product_media": [
        {
          "url": "https://file-host.link/website/terrapin-industrial-89rx2t/assets/refined-images/1771421557348899_98b89210ab1a4adb94086f27090179a6/1080.webp"
        }
      ],
      "support_service": [
        "Technical Support",
        "Installation Service",
        "Field customization support for entry port configuration",
        "Specification sheet and documentation available for download"
      ],
      "served_locations": [
        "USA",
        "Canada"
      ],
      "shipping_returns": "Shipping and return information available upon request. Product can be installed as pre-assembled fully integrated system or in stages in the field.",
      "key_features_usps": [
        "Patented expandable design allows enclosure to fit single, double, or triple instrument configurations",
        "Customizable entry ports can be field-punched into replaceable back plate for power wiring, control wiring, and process tubes",
        "IP65 protection with ability to maintain > 75\\u00b0F/23.9\\u00b0C in -60\\u00b0F/-51.1\\u00b0C environments when equipped with ThermaGuard Heated Liner",
        "Individual parts can be replaced independently, reducing maintenance costs and downtime",
        "Can be installed as pre-assembled fully integrated system or in stages in the field for maximum flexibility"
      ],
      "ownership_options": [
        "Purchase"
      ],
      "product_identifier": "ThermaGuard Expandable Enclosure System",
      "pricing_information": "Pricing Available on Request",
      "applications_use_cases": [
        "Industrial instrument protection in extreme cold environments",
        "Multiple instrument configuration installations requiring flexible enclosure solutions",
        "Oil and gas field instrumentation protection",
        "Process control equipment housing in harsh weather conditions",
        "Arctic and sub-zero temperature applications requiring heated enclosures"
      ],
      "regulatory_information": [
        "Complies with IP65 protection standard for dust and water ingress",
        "Class 1 Division 2 rated thermo-electric coolers available for hazardous location applications",
        "Suitable for use in environments down to -60\\u00b0F/-51.1\\u00b0C"
      ],
      "associate_certifications": [
        "IP65",
        "Class 1 Division 2 (thermo-electric coolers)"
      ],
      "technical_specifications": {
        "Color": "Light grey",
        "Hinges": "(2) Stainless steel hinges",
        "Weight": "Single 50lbs (22.68kg), Double 75lbs (34kg), Triple 130lbs (59kg)",
        "Latches": "(2) Stainless steel latches",
        "Hardware": "All stainless steel hardware",
        "Lip Support": "(1) Stainless steel lid support",
        "Material Type": "GRP - glass reinforced polyester",
        "Gasket Material": "EPDM",
        "Inner Dimensions": "21.95\\" x 17.92\\" x 23.08\\" (55.75cm x 45.51cm x 58.62cm) H x W x L",
        "Outer Dimensions": "23.58\\" x 18.75\\" x 23.61\\" (59.89cm x 47.62cm x 59.96cm) H x W x L",
        "Material Thickness": "Approximately 1/4\\" (0.635cm)",
        "Temperature Rating": "> 75\\u00b0F/23.9\\u00b0C in -60\\u00b0F/-51.1\\u00b0C environment (with ThermaGuard Heated Liner)",
        "Insulation K Factor": ".159 BTU (IT) inch/hour/foot\\u00b2/Fahrenheit",
        "Protection Standard": "IP65",
        "Pipe Stand Mount Size": "Schedule 40 2\\" pipe diameter (2.375\\") / Schedule 40 5.08cm pipe diameter (6.03cm)"
      }
    }
  },
  {
    "name": "ThermaGuard Heated Enclosure Liner",
    "details": {
      "image_id": "refined-images/1771421557322513_fdb80f22291848d8a5bce5e99cb2d024",
      "filter_data": {
        "Heat Source": [
          "Electric (AC)"
        ],
        "Product Type": [
          "Heater"
        ],
        "Primary Material": [
          "Aluminum"
        ],
        "Protection & Safety Rating": [
          "T6 Hazardous Area"
        ]
      },
      "product_key": "https://terrapin-industrial.com/thermaguard-heated-liner/",
      "manufacturer": "Terrapin Industrial",
      "product_name": "ThermaGuard Heated Enclosure Liner",
      "product_media": [
        {
          "url": "https://file-host.link/website/terrapin-industrial-89rx2t/assets/refined-images/1771421557322513_fdb80f22291848d8a5bce5e99cb2d024/1080.webp"
        }
      ],
      "support_service": [
        "Technical Support Available",
        "Specification Sheet Download Available",
        "Installation Guidance",
        "Custom Configuration Options"
      ],
      "served_locations": [
        "USA",
        "North America",
        "Canada"
      ],
      "shipping_returns": "Shipping and return information available upon request. Product includes heater cable with 30-year life expectancy and manufacturer warranty details available from Terrapin Industrial.",
      "key_features_usps": [
        "Patent-pending design with 30-year heater cable life expectancy, versus 5-year typical failure rate of traditional finned and block heaters",
        "Eliminates finned heaters, GUAT and rigid conduit for more spacious enclosure interior and greater access to instrumentation",
        "Exceptional heat output ranges from 108 watts to 720 watts for extreme temperature environments",
        "Rated for use in hazardous T6 areas, providing superior safety compared to traditional heaters limited to T3 (392\\u00b0F)",
        "Easy 2-piece removable design with integrated heater cable entry for seamless installation and maintenance"
      ],
      "ownership_options": [
        "Purchase"
      ],
      "product_identifier": "ThermaGuard Heated Liner",
      "pricing_information": "Pricing Available on Request",
      "applications_use_cases": [
        "Freeze protection for industrial enclosures in extreme cold environments",
        "Hazardous area installations requiring T6-rated heating solutions",
        "Process control and instrumentation enclosures requiring reliable temperature maintenance",
        "Oil and gas industry enclosure heating applications",
        "Industrial facilities requiring space-efficient heating with superior access to process tubing and instruments"
      ],
      "regulatory_information": [
        "Suitable for hazardous area T6 installations",
        "Heater cable rated for specific hazardous area classifications",
        "Complies with industrial heating safety standards for extreme temperature environments"
      ],
      "associate_certifications": [
        "Hazardous Area T6 Rating"
      ],
      "technical_specifications": {
        "Design": "2-piece removable design with patent-pending technology",
        "Heater Matrix": "Aluminum Liner Matrix",
        "Life Expectancy": "30 years (heater cable)",
        "Heat Output Range": "108 watts (3watt/ft cable) to 720 watts (20watt/ft cable)",
        "Insulation Options": "Molded urethane 1\\" or 3/8\\", Pyrogel, mineral wool, or fiberglass temp mat",
        "Cable Power Options": "3 Watts/ft to 20 Watts/ft",
        "Hazardous Area Rating": "T6 areas (vs T3/392\\u00b0F for traditional finned/block heaters)",
        "Inner Liner Material - ABS": "Up to 200\\u00b0F (93.3\\u00b0C)",
        "Inner Liner Material - PolyCarbonate": "Up to 275\\u00b0F (135\\u00b0C)"
      }
    }
  },
  {
    "name": "ThermaGuard Retrofittable Enclosure",
    "details": {
      "product_key": "https://terrapin-industrial.com/retrofittable-enclosures/",
      "manufacturer": "Terrapin Industrial",
      "product_name": "ThermaGuard Retrofittable Enclosure",
      "support_service": [
        "Technical Support",
        "Installation Service",
        "Field installation support for process tubing, electrical, block heaters, calibration and testing",
        "Replacement parts available for individual components"
      ],
      "served_locations": [
        "USA",
        "Canada"
      ],
      "shipping_returns": "Shipping and return information available upon request. Product includes stainless steel hardware and optional accessories for field installation.",
      "key_features_usps": [
        "Patented modular design allows installation around existing instruments without taking them offline",
        "Pre-engineered holes for conduit and tubing bundles simplify installation and reduce total install time and cost by 30%",
        "Can maintain > 75\\u00b0F/23.9\\u00b0C in -60\\u00b0F/-51.1\\u00b0C environments when used with ThermaGuard Heated Liner",
        "Individual parts can be replaced; enclosure can be installed all at once or in stages",
        "Optional removable insulation in 1\\" Urethane or 10-20mm Pyrogel for enhanced thermal protection"
      ],
      "ownership_options": [
        "Purchase"
      ],
      "product_identifier": "FAS001",
      "pricing_information": "Pricing Available on Request",
      "applications_use_cases": [
        "Industrial instrument protection in extreme cold environments",
        "Retrofit applications for existing instrumentation requiring environmental protection",
        "Oil and gas industry instrument enclosures",
        "Process control instrument protection in Arctic conditions",
        "Field installations requiring modular, staged assembly around operational equipment"
      ],
      "regulatory_information": [
        "IP 66 protection standard compliant for dust-tight and water-resistant performance",
        "Designed for extreme temperature environments (-60\\u00b0F/-51.1\\u00b0C to > 75\\u00b0F/23.9\\u00b0C)",
        "Constructed with glass-reinforced ASA plastic for durability and environmental resistance"
      ],
      "associate_certifications": [
        "IP 66"
      ],
      "technical_specifications": {
        "Color": "Light grey",
        "Hinges": "(2) Stainless steel hinges",
        "Weight": "19.4 lbs (8.8 Kg) with EPDM gaskets or 15.8 lbs (7.167 Kg) with Neoprene gaskets",
        "Latches": "(2) Stainless steel latches",
        "Hardware": "All stainless steel hardware",
        "Lid Support": "(1) Stainless steel lid support",
        "Material Type": "ASA Plastic with glass reinforcement",
        "Gasket Material": "EPDM or Neoprene gaskets",
        "Material Thickness": "Approx \\u00bc\\" (0.635cm)",
        "Temperature Rating": "> 75\\u00b0F/23.9\\u00b0C in -60\\u00b0F/-51.1\\u00b0C environment (with ThermaGuard Heated Liner)",
        "Insulation K Factor": "0.159 BTU (IT) inch/hour/foot\\u00b2/Fahrenheit (optional insulation)",
        "Protection Standard": "IP 66",
        "Pipe Stand Mount Size": "Schedule 40 2\\" pipe diameter (2.375\\" / 6.03cm)",
        "Inner Dimensions (H x W x L)": "21.95\\" x 17.92\\" x 23.08\\" (55.75cm x 45.51cm x 58.62cm)",
        "Outer Dimensions (H x W x L)": "23.58\\" x 18.75\\" x 23.61\\" (59.89cm x 47.62cm x 59.96cm)"
      }
    }
  }
]`,
  paaDataJson: `[
  "What is the best material for outdoor electrical enclosures?",
  "Which type of outdoor enclosure will protect electrical equipment from corrosive agents?",
  "What Nema enclosure type is best suited for outdoor watertight applications?"
]`,
};

const CLIENT_TRINU_POWDER_COATING: ClientSample = {
  id: `885d612b-02ff-45ce-b06c-b5b51c24a570`,
  slug: `trinu-powder-coating`,
  name: `TriNu Powder Coating`,
  url: `https://trinupowdercoating.com/`,
  primaryLogoUrl: `https://file-host.link/website/trinupowdercoating-kp0fq9/assets/logo/logo.webp`,
  sampleServiceTopic: `Professional Sandblasting Services in Clearwater, FL`,
  sampleCategoryTopic: ``,
  sampleBlogTopic: `Top Powder Coating Finishes for Precision Metal Parts`,
  designTokensJson: `{
  "fonts": {
    "body_font_url": "https://fonts.googleapis.com/css2?family=Inter:wght@300..700&display=swap",
    "heading_font_url": "https://fonts.googleapis.com/css2?family=Urbanist:wght@300..700&display=swap"
  },
  "css_variables": {
    "--color-brand-text": "#1a1500",
    "--font-family-body": "Inter, ui-sans-serif, system-ui, sans-serif",
    "--color-brand-primary": "#DB4400",
    "--font-family-heading": "Urbanist, ui-sans-serif, system-ui, sans-serif",
    "--color-brand-secondary": "#2B5104",
    "--color-brand-text-muted": "#A2A2A2",
    "--color-brand-primary-dark": "#8f2c00",
    "--color-brand-text-inverse": "#ffffff",
    "--color-brand-text-primary": "#382C01",
    "--color-brand-primary-hover": "#b83900",
    "--color-brand-primary-light": "rgba(219, 68, 0, 0.05)",
    "--color-brand-text-tertiary": "#6b6b6b",
    "--color-brand-primary-medium": "rgba(219, 68, 0, 0.1)",
    "--color-brand-secondary-dark": "#162602",
    "--color-brand-text-secondary": "#2B5104",
    "--color-brand-secondary-hover": "#1e3a03",
    "--color-brand-secondary-light": "rgba(43, 81, 4, 0.05)",
    "--color-brand-secondary-medium": "rgba(43, 81, 4, 0.1)",
    "--color-brand-primary-foreground": "#ffffff",
    "--color-brand-secondary-foreground": "#ffffff"
  }
}`,
  companyInfoJson: `{
  "name": {
    "dba_name": null,
    "legal_name": "Trinu Powder Coating",
    "company_name": "TriNu Powder Coating"
  },
  "founded": {
    "founded_date_year": 2017,
    "years_in_business": "20+ years industry experience"
  },
  "locations": {
    "branch_locations": [],
    "headquarters_address": "7721 Rutillio Ct, Ste A, New Port Richey, FL 34653"
  },
  "credentials": {
    "memberships": [],
    "accreditations": [],
    "certifications": [],
    "business_licenses": []
  },
  "company_size": {
    "employee_count": null,
    "annual_turnover": null
  },
  "service_team": {
    "team_members": [],
    "employee_count": null,
    "years_of_experience": 20
  },
  "company_story": {
    "milestones": [
      "2017: TriNu Powder Coating founded",
      "20,000+ projects completed",
      "Built 10' × 10' × 30' large-scale production oven capacity"
    ],
    "founding_story": "The company was founded with a simple goal: to provide dependable finishing work businesses could count on. Built here in the Tampa Bay area, the company grew out of hands-on industry experience and a belief that quality comes from doing the fundamentals right.",
    "company_history": "TriNu Powder Coating was started with a simple goal: to provide dependable finishing work businesses could count on. Built in the Tampa Bay area, the company grew out of hands-on industry experience and a belief that quality comes from doing the fundamentals right. Since 2017, the focus has been on following proven processes, preparing parts properly, and delivering consistent results customers can plan around.",
    "growth_narrative": "From the beginning, the focus has been on preparation, process, and follow-through. As TriNu has grown, the company has continued to invest in better equipment, updated powder systems, and a strong team—always with the same mindset: do the work carefully, follow proven steps, and deliver finishes built to last."
  },
  "phone_numbers": [
    "(727) 316-6700"
  ],
  "service_areas": [
    "Tampa Bay area",
    "Clearwater",
    "Tarpon Springs",
    "New Port Richey"
  ],
  "email_addresses": [
    "service@trinupowdercoating.com"
  ],
  "major_customers": [],
  "value_propositions": {
    "key_benefits": [
      "Consistent, repeatable results job after job",
      "Dependable turnaround times for production planning",
      "Reduced risk and minimized rework",
      "Clear communication throughout the project",
      "Durable finishes built to last",
      "Supports production schedules without disruption"
    ],
    "market_positioning": "The dependable finishing partner for manufacturers and fabricators in Tampa Bay who require consistent quality, controlled processes, and reliable turnaround times for industrial powder coating and sandblasting services",
    "competitive_advantages": [
      "20+ years supporting industrial and manufacturing partners",
      "Built for scale with large-scale production capacity",
      "Proven surface prep and coating processes with no shortcuts",
      "Pick-up and delivery services throughout Tampa Bay area",
      "High client retention rate"
    ],
    "unique_selling_propositions": [
      "10' × 10' × 30' production oven for large-scale capacity",
      "Process-driven approach with controlled application and verified curing",
      "Complete surface preparation, finishing, and logistics under one roof",
      "Every job inspected before release"
    ]
  },
  "awards_recognitions": [],
  "social_media_profiles": {
    "other": [],
    "yelp_url": null,
    "twitter_url": null,
    "youtube_url": null,
    "facebook_url": null,
    "linkedin_url": null,
    "whatsapp_url": null,
    "instagram_url": null
  },
  "target_customer_segments": [
    "Manufacturing & OEM",
    "Fabrication",
    "Construction & Architectural",
    "Commercial & Industrial"
  ],
  "mission_statement_company_values": {
    "vision": null,
    "taglines": [
      "Industrial Powder Coating You Can Rely On",
      "Consistent quality. Reliable turnaround."
    ],
    "core_values": [
      "Integrity - We do the work the right way—honestly, responsibly, and without shortcuts",
      "Quality - Every job is handled with care, from preparation through final cure, to deliver durable, consistent finishes",
      "Reliability - We stand by our commitments and follow through with dependable timelines and results",
      "Teamwork - We work together with respect and accountability, supporting each other and our customers at every step",
      "Customer Focus - We listen first, communicate clearly, and approach each project with our customers' goals in mind",
      "Get It Done - We stay focused, solve problems, and deliver real results"
    ],
    "mission_statement": "To provide dependable finishing work businesses could count on"
  }
}`,
  additionalInfoJson: `{
  "business_profile": {
    "inventory_nature": "100% Service-Based Business Model—no physical product inventory sold; all revenue from labor-based finishing services (surface prep, coating application, curing, logistics).",
    "business_identity": "Industrial powder coating and abrasive blasting service provider serving manufacturers, fabricators, and contractors in the Tampa Bay area—does not sell products or equipment, only provides finishing services.",
    "primary_verticals": [
      "Powder Coating Services",
      "Abrasive Blasting / Sand Blasting Services",
      "Surface Preparation Services",
      "Pick-Up & Delivery Logistics",
      "Industrial Finishing for Manufacturing/OEM",
      "Metal Fabrication Finishing",
      "Architectural & Construction Finishing"
    ],
    "explicit_out_of_scope": [
      "Product Sales (no equipment, parts, or consumables sold)",
      "Powder Coating Equipment Sales",
      "Blasting Media Sales",
      "Rental Services",
      "Repair Services (mechanical/structural)",
      "Manufacturing/Fabrication Services (does not fabricate parts)",
      "Residential/Consumer Services",
      "Automotive Retail Services",
      "Marine Vessel Manufacturing",
      "Paint/Liquid Coating Services",
      "Welding Services",
      "Machining Services",
      "Raw Material Supply"
    ]
  }
}`,
  logoUrlsJson: `{
  "favicon": "https://file-host.link/website/trinupowdercoating-kp0fq9/assets/logo/1775657666295422_fc58053fc9734a7faa3edef3084bb91d.webp",
  "primary_logo": "https://file-host.link/website/trinupowdercoating-kp0fq9/assets/logo/logo.webp"
}`,
  serviceCatalogJson: `[
  {
    "name": "Powder Coating",
    "details": {
      "availability": "Not specified",
      "service_name": "Powder Coating",
      "pricing_offers": "[\\n    \\"Fair price mentioned but specific pricing not provided\\"\\n]",
      "service_description": "Custom powder coating services with over 10 years of experience. The company uses high quality products and is committed to meeting the needs of every customer with outstanding service for a fair price. They offer QC Certified Program compliance, TDS Compliance, and use AAMA Certified Products. The service includes technical development support and focuses on building partnerships with customers to combine expertise for unique projects. They handle architectural applications, mil specifications, and marine grade applications."
    }
  },
  {
    "name": "Abrasive Blasting",
    "details": {
      "service_name": "Abrasive Blasting",
      "service_description": "Abrasive blasting services delivered with over 10 years of hands-on industry experience, designed to prepare surfaces for optimal coating performance and long-term durability. The process uses carefully selected abrasive media to remove rust, scale, old coatings, and surface contaminants while maintaining substrate integrity. The service emphasizes quality control, consistency, and precision, supporting a wide range of industrial, architectural, and specialty applications. Each project is handled with a partnership-first approach, ensuring surface preparation aligns with technical requirements, project specifications, and downstream coating performance."
    }
  },
  {
    "name": "Sand Blasting",
    "details": {
      "availability": "Not specified",
      "service_name": "Sand Blasting",
      "pricing_offers": "[\\n    \\"Fair price mentioned but specific pricing not provided\\"\\n]",
      "service_description": "Sand blasting services (also referred to as Media Blasting) provided with over 10 years of experience. The service is delivered with the same commitment to quality and customer relationships as their powder coating services, using high quality products."
    }
  },
  {
    "name": "Shot Blasting",
    "details": {
      "service_name": "Shot Blasting",
      "service_description": "Shot blasting services provided with over a decade of experience, focused on achieving uniform surface cleaning, profiling, and strengthening for metal components and structures. Using controlled metallic shot media, the process delivers consistent surface finishes while improving adhesion readiness and fatigue resistance. The service supports industrial, structural, and high-performance applications, maintaining strict quality standards and repeatability. A collaborative approach ensures blasting parameters are optimized for each project\\u2019s functional and performance requirements."
    }
  },
  {
    "name": "Grit Blasting",
    "details": {
      "service_name": "Grit Blasting",
      "service_description": "Grit blasting services backed by over 10 years of experience, ideal for aggressive surface preparation where precise profiling and deep cleaning are required. The process uses angular grit media to effectively remove heavy corrosion, coatings, and surface irregularities, creating a strong anchor profile for advanced coating systems. The service is executed with a strong focus on quality, safety, and surface consistency, supporting architectural, industrial, and specialty-grade applications. Each project is approached as a technical collaboration to ensure surface preparation meets exact specifications and performance goals."
    }
  }
]`,
  productInformationJson: `[]`,
  paaDataJson: `[
  "What is the best powder coat finish for metal parts?",
  "How long should powder coating last on metal?"
]`,
};

const CLIENT_7BROWN: ClientSample = {
  id: `4e8a2e1b-6ba9-4a00-8ea9-5a1a07b4d2ca`,
  slug: `7brown`,
  name: `7 Brown`,
  url: `https://7brown.com/`,
  primaryLogoUrl: `https://file-host.link/website/7brown-injpl7/assets/logo/logo.webp`,
  sampleServiceTopic: ``,
  sampleCategoryTopic: ``,
  sampleBlogTopic: ``,
  designTokensJson: `{
  "fonts": {
    "body_font_url": "https://fonts.googleapis.com/css2?family=Inter:wght@300..700&display=swap",
    "heading_font_url": "https://fonts.googleapis.com/css2?family=Urbanist:wght@300..700&display=swap"
  },
  "css_variables": {
    "--color-brand-text": "#1A1A1A",
    "--font-family-body": "Inter, ui-sans-serif, system-ui, sans-serif",
    "--color-brand-primary": "#1A1A1A",
    "--font-family-heading": "Urbanist, ui-sans-serif, system-ui, sans-serif",
    "--color-brand-secondary": "#4A4A4A",
    "--color-brand-text-muted": "#9E9E9E",
    "--color-brand-primary-dark": "#000000",
    "--color-brand-text-inverse": "#ffffff",
    "--color-brand-text-primary": "#111111",
    "--color-brand-primary-hover": "#0D0D0D",
    "--color-brand-primary-light": "rgba(26, 26, 26, 0.05)",
    "--color-brand-text-tertiary": "#6B6B6B",
    "--color-brand-primary-medium": "rgba(26, 26, 26, 0.1)",
    "--color-brand-secondary-dark": "#2E2E2E",
    "--color-brand-text-secondary": "#3D3D3D",
    "--color-brand-secondary-hover": "#333333",
    "--color-brand-secondary-light": "rgba(74, 74, 74, 0.05)",
    "--color-brand-secondary-medium": "rgba(74, 74, 74, 0.1)",
    "--color-brand-primary-foreground": "#ffffff",
    "--color-brand-secondary-foreground": "#ffffff"
  }
}`,
  companyInfoJson: `{
  "name": {
    "dba_name": null,
    "legal_name": null,
    "company_name": "7 Brown Farms"
  },
  "founded": {
    "founded_date_year": 1885,
    "years_in_business": "Seven generations strong"
  },
  "locations": {
    "branch_locations": [],
    "headquarters_address": "26985 State Rd Z, St Mary MO 63673"
  },
  "credentials": {
    "memberships": [],
    "accreditations": [],
    "certifications": [
      "USDA inspected"
    ],
    "business_licenses": []
  },
  "company_size": {
    "employee_count": null,
    "annual_turnover": null
  },
  "service_team": {
    "team_members": [
      {
        "bio": "Contact person for farm operations, custom orders, and steakhouse partnerships. Available at 314-540-5515.",
        "name": "Farmer Brown",
        "title": "Farmer/Owner",
        "headshot_image": null
      }
    ],
    "employee_count": null,
    "years_of_experience": null
  },
  "company_story": {
    "milestones": [
      "1885: Farm founded in Missouri Ozarks",
      "Started selling and shipping direct to consumers and restaurants",
      "Acquired Italian Stagionello 200 kg dry aging cabinet for premium steakhouse service"
    ],
    "founding_story": "The farm's name, 7 Brown Farms, nods back to early American revolutionary settlers that tilled, defended, and produced the best proteins that the Ozarks could make under the sun.",
    "company_history": "7 Brown Farms is a family legacy farm founded in the Missouri Ozarks in 1885. The name nods back to early American revolutionary settlers that tilled, defended, and produced the best proteins that the Ozarks could make under the sun. The family remains farmers, merchants, and veterans today, committed to raising the best meats and farm products in the most sustainable way.",
    "growth_narrative": "The farm started selling and shipping direct to consumers and restaurants as a smarter way to craft the best meat proteins. They evolved from traditional farming to offering specialized services including 45-day dry aging for steakhouses, custom bulk orders, and nationwide shipping. The family invested in sustainable grazing improvements, nutritional quality labels, and solutions to demanding pasture climates while maintaining their commitment to small craft batch production."
  },
  "phone_numbers": [
    "314-540-5515",
    "+1 314-540-5515"
  ],
  "service_areas": [
    "Missouri Ozarks",
    "Within 100 miles of St Mary, MO 63673 for bulk deliveries",
    "Two-day shipping zone for direct shipments"
  ],
  "working_hours": {
    "Friday": [
      "8AM-5PM"
    ],
    "Monday": [
      "8AM-5PM"
    ],
    "Sunday": [
      "Closed"
    ],
    "Tuesday": [
      "9AM-5PM"
    ],
    "Saturday": [
      "9AM-12PM"
    ],
    "Thursday": [
      "8AM-5PM"
    ],
    "Wednesday": [
      "8AM-5PM"
    ]
  },
  "email_addresses": [],
  "major_customers": [
    {
      "customer_name": "Knife (Dallas steakhouse)",
      "customer_logo_url": null
    }
  ],
  "ratings_reviews": {
    "GBP": {
      "rating": 5,
      "review_count": 1
    }
  },
  "business_category": [
    "Meat products store"
  ],
  "value_propositions": {
    "key_benefits": [
      "Know exactly where your food comes from and how it was raised",
      "Superior marbling for exceptional taste",
      "Convenient packaging for easy storage",
      "Fair prices that help family farms",
      "On-time, frozen-tight shipping",
      "Loaded for Omega 6 and 3 balance for brain, body, and spirit fuel",
      "Custom cut sheets available for bulk orders"
    ],
    "market_positioning": "Premium craft beef producer serving small but mighty buyers who demand uncompromised quality through direct-from-farm, sustainably-raised, dry-aged American Black Angus beef.",
    "competitive_advantages": [
      "Seven generations of farming experience since 1885",
      "Direct farm-to-consumer shipping model",
      "Single estate, limited release production",
      "Craft seam butcher processing",
      "Sustainable pasture-raised practices",
      "Custom wrapped cuts",
      "White glove appointment delivery service within 100 miles"
    ],
    "unique_selling_propositions": [
      "100% American Black Angus from single estate",
      "Always marbled and 14-day dry-aged",
      "Only Pure Ozark American Black Angus Protein",
      "Never imported, mixed, or long-hauled",
      "No hormones, antibiotics, mRNA vaccines, or additives",
      "Custom grain finish unique to the Missouri Ozarks",
      "45-day dry aging service using Italian Stagionello cabinets with University of Florence methods",
      "Less than 15% shrink loss on dry-aged primals"
    ]
  },
  "awards_recognitions": [],
  "social_media_profiles": {
    "other": [],
    "yelp_url": null,
    "twitter_url": null,
    "youtube_url": null,
    "facebook_url": null,
    "linkedin_url": null,
    "whatsapp_url": null,
    "instagram_url": null
  },
  "target_customer_segments": [
    "Families seeking premium beef",
    "Athletes requiring high-protein diets",
    "Steakhouses and fine dining restaurants",
    "Dining clubs",
    "Health-conscious consumers",
    "Customers seeking farm-direct meats",
    "Gift buyers for special occasions"
  ],
  "mission_statement_company_values": {
    "vision": "At 7 Brown, we cannot fix all of the food system challenges that exist today in America. However, we are confident that we can solve your family's protein needs by trying our craft products today.",
    "taglines": [
      "Family Direct Meats Quality Black Angus Beef Crafted from Field to Fork",
      "Exceptionally-Marbled Ozark Cuts, Because You are Worth It"
    ],
    "core_values": [
      "Sustainable grazing practices",
      "High care, low stress cattle management",
      "Quality diet for cattle",
      "Uncompromised quality through small craft batch beef",
      "Direct-to-consumer transparency"
    ],
    "mission_statement": "We remain a family of farmers, merchants, and veterans today, who are committed to raising the best meats and farm products in the most sustainable way."
  }
}`,
  additionalInfoJson: `{
  "business_profile": {
    "inventory_nature": "100% Fresh-Frozen Beef Products: Ground chuck (primary volume driver), premium steaks (ribeye, sirloin, picanha), specialty cuts (brisket, flat iron, Denver steak), and restaurant-grade dry-aged primals",
    "business_identity": "Direct-to-consumer farm selling 100% American Black Angus beef raised on a single Missouri estate, offering craft-butchered cuts with 14-day minimum dry aging and optional white-glove delivery within 100 miles of the farm.",
    "primary_verticals": [
      "Ground Beef Products",
      "Premium Steak Cuts",
      "Specialty Beef Cuts",
      "Bulk Freezer Orders",
      "Extended Dry-Aged Primals"
    ],
    "explicit_out_of_scope": [
      "Live cattle sales",
      "Imported or blended beef products",
      "Pork, poultry, lamb, or non-beef proteins",
      "Processed/cured meats (sausages, bacon, deli meats)",
      "Grocery items or produce",
      "Equipment or farm supplies",
      "Rental services",
      "On-site butchering services for customer-owned animals",
      "Beef from other farms or co-ops",
      "Commodity/industrial beef distribution",
      "Restaurants or food service operations"
    ]
  }
}`,
  logoUrlsJson: `{
  "favicon": "https://file-host.link/website/7brown-injpl7/assets/logo/1774995829126898_fa3e99287e584d5b8c06d830c68762ba.jpg",
  "gbp_url": "https://file-host.link/website/7brown-injpl7/assets/logo/1774995631193353_1d5c3896a43a487fa64dc1d39f8eb6b1.webp",
  "primary_logo": "https://file-host.link/website/7brown-injpl7/assets/logo/logo.webp"
}`,
  serviceCatalogJson: `[]`,
  productInformationJson: `[]`,
  paaDataJson: `{}`,
};

const CLIENT_ABBAHVAC: ClientSample = {
  id: `0aaea6a9-be94-4fda-9d83-db684b899f0c`,
  slug: `abbahvac`,
  name: `Abba HVAC`,
  url: `https://abbahvac.com/`,
  primaryLogoUrl: `https://file-host.link/website/abbahvac-26qufs/assets/uploaded-assets/1765366762364000_6e39d050f2fc47d1b5363ec6bce5bb43`,
  sampleServiceTopic: ``,
  sampleCategoryTopic: ``,
  sampleBlogTopic: ``,
  designTokensJson: `{
  "fonts": {
    "body_font_url": "https://fonts.googleapis.com/css2?family=Inter:wght@300..700&display=swap",
    "heading_font_url": "https://fonts.googleapis.com/css2?family=Urbanist:wght@300..700&display=swap"
  },
  "css_variables": {
    "--color-brand-text": "#232629",
    "--font-family-body": "Inter, ui-sans-serif, system-ui, sans-serif",
    "--color-brand-primary": "#3265A8",
    "--font-family-heading": "Urbanist, ui-sans-serif, system-ui, sans-serif",
    "--color-brand-secondary": "#F38D64",
    "--color-brand-text-muted": "#9BA1A8",
    "--color-brand-primary-dark": "#1E3A66",
    "--color-brand-text-inverse": "#ffffff",
    "--color-brand-text-primary": "#232629",
    "--color-brand-primary-hover": "#284F87",
    "--color-brand-primary-light": "rgba(50, 101, 168, 0.05)",
    "--color-brand-text-tertiary": "#6B7178",
    "--color-brand-primary-medium": "rgba(50, 101, 168, 0.1)",
    "--color-brand-secondary-dark": "#D96843",
    "--color-brand-text-secondary": "#4A4E52",
    "--color-brand-secondary-hover": "#E6754A",
    "--color-brand-secondary-light": "rgba(243, 141, 100, 0.05)",
    "--color-brand-secondary-medium": "rgba(243, 141, 100, 0.1)",
    "--color-brand-primary-foreground": "#ffffff",
    "--color-brand-secondary-foreground": "#ffffff"
  }
}`,
  companyInfoJson: `{
  "name": {
    "dba_name": null,
    "legal_name": "Abba HVAC",
    "company_name": "Abba HVAC"
  },
  "founded": {
    "founded_date_year": 2025,
    "years_in_business": "35"
  },
  "locations": {
    "branch_locations": [],
    "headquarters_address": "Austin, Texas"
  },
  "credentials": {
    "memberships": [],
    "accreditations": [],
    "certifications": [
      "Energy Audit Certified"
    ],
    "business_licenses": [
      "Texas Licensed Contractor"
    ]
  },
  "company_size": {
    "employee_count": 10,
    "annual_turnover": null
  },
  "service_team": {
    "team_members": [
      {
        "bio": "Sascha is the guy who gets excited about fixing problems that make other technicians scratch their heads. With 20+ years of experience in HVAC and construction, he's built a reputation for delivering energy-efficient solutions that actually work. As a proud girl-dad, Sascha has zero patience for systems that don't run right. Whether your setup is ancient or brand new, he treats every job like it's for his own family—because that's just who he is. Beyond the job site, Sascha is an educator and the founder of The HVAC Game on YouTube, Instagram, and Skool. He helps growth-minded HVAC techs build confidence in their troubleshooting skills and grow in the industry.",
        "name": "Sascha Hinz",
        "title": "Founder",
        "headshot_image": "https://cdn.prod.website-files.com/68e7913aa58f5b95db115158/6901fc308064cdef5f7541e5_WhatsApp%20Image%202025-10-21%20at%2022.22.44%20(1).jpeg"
      },
      {
        "bio": "Alice is the one who makes sure everything actually works behind the scenes. With over two decades of experience in real estate development & business operations across Canada, Australia, the UK, and the US, she knows what it takes to build companies that last. Now she's bringing that expertise into building the HVAC company she always wanted to work with. Alice is the reason you'll get straight answers, fair pricing, and follow-up calls that actually happen. Think of her as the person who turns craftsmanship into customer care.",
        "name": "Alice Huang",
        "title": "Founder",
        "headshot_image": "https://cdn.prod.website-files.com/68e7913aa58f5b95db115158/68e95c961b1598e618dbeed7_Alice%20Huang.jpg"
      }
    ],
    "employee_count": 10,
    "years_of_experience": 35
  },
  "company_story": {
    "milestones": [
      "2007: Licensed and insured since 2007"
    ],
    "founding_story": "Founded on the principle that when something breaks in your home or business, you shouldn't have to call three different people. Led by Sascha Hinz, with over 20 years of HVAC and construction expertise, and Alice Huang, bringing 17 years of operations excellence across four continents.",
    "company_history": "Abba HVAC began as a solution to Central Texas's need for comprehensive, reliable contractor services. The company has grown to serve the entire Greater Austin area, providing 24/7 emergency service alongside comprehensive maintenance programs.",
    "growth_narrative": "Today, Abba HVAC has grown to serve the entire Greater Austin area, from downtown to surrounding communities, providing 24/7 emergency service alongside comprehensive maintenance programs. Their commitment to energy efficiency and transparent pricing has made them Central Texas's go-to choice for HVAC, electrical, and plumbing solutions, earning the trust of homeowners, commercial property managers, and business owners who value reliability and professional excellence."
  },
  "phone_numbers": [
    "(737) 210-3999",
    "+1 737-210-3999"
  ],
  "service_areas": [
    "Central Austin",
    "Cedar Park",
    "Round Rock",
    "Georgetown",
    "Pflugerville",
    "Leander",
    "Barton Creek",
    "Barton Hills",
    "Bee Cave",
    "Bouldin Creek",
    "Buda",
    "Dripping Springs",
    "Easton Park",
    "Hutto",
    "Kyle",
    "Lake Communities",
    "Lakeway",
    "North Austin",
    "Northwest",
    "Northwest Hills",
    "Old Enfield",
    "Pemberton Heights",
    "River Ranch",
    "South Austin",
    "South Lamar",
    "Spicewood",
    "Steiner Ranch",
    "Tarrytown",
    "Taylor",
    "Triangle State",
    "West Austin",
    "Westlake Hills",
    "Wimberley",
    "Zilker"
  ],
  "email_addresses": [
    "info@abbahvac.com"
  ],
  "major_customers": [
    {
      "customer_name": "David R.",
      "customer_logo_url": null
    },
    {
      "customer_name": "Sarah M.",
      "customer_logo_url": null
    },
    {
      "customer_name": "James C.",
      "customer_logo_url": null
    }
  ],
  "ratings_reviews": {
    "GBP": {
      "rating": 5,
      "review_count": 14
    }
  },
  "business_category": [
    "HVAC contractor"
  ],
  "target_geographies": [
    "us"
  ],
  "value_propositions": {
    "key_benefits": [
      "Lower energy bills",
      "Consistent temperatures throughout home",
      "Improved air quality",
      "Preventive maintenance that extends system life"
    ],
    "market_positioning": "Central Texas's go-to choice for comprehensive HVAC, electrical, and plumbing solutions with dad-level care and professional-grade service.",
    "competitive_advantages": [
      "20+ years of technical expertise",
      "Licensed and insured",
      "Deep knowledge of Central Texas climate and building codes"
    ],
    "unique_selling_propositions": [
      "One contractor for HVAC, electrical, and plumbing",
      "24/7 emergency service",
      "Energy efficiency expertise"
    ]
  },
  "awards_recognitions": [],
  "social_media_profiles": {
    "other": [],
    "yelp_url": null,
    "twitter_url": null,
    "youtube_url": null,
    "facebook_url": null,
    "linkedin_url": null,
    "whatsapp_url": null,
    "instagram_url": null
  },
  "target_customer_segments": [
    "Residential homes",
    "Commercial buildings",
    "Restaurants",
    "Gyms",
    "Office complexes"
  ],
  "mission_statement_company_values": {
    "vision": "To be Central Texas's most trusted contractor, known for integrity, quality workmanship, and comprehensive solutions that make life easier for homeowners and businesses across the Greater Austin area.",
    "taglines": [
      "Dad-level care. Professional-grade service.",
      "Your trusted partner for HVAC, electrical, and plumbing solutions across Central Texas."
    ],
    "core_values": [
      "Dad-level Care",
      "Professional Service",
      "Honesty",
      "Reliability",
      "Comprehensive Service Excellence"
    ],
    "mission_statement": "To provide comprehensive, reliable HVAC, electrical, and plumbing solutions to Central Texas communities with dad-level care and professional-grade service, ensuring comfort and peace of mind for every customer."
  }
}`,
  additionalInfoJson: `{
  "business_profile": {
    "inventory_nature": "100% Services / 0% Physical Products",
    "business_identity": "Full-service HVAC, electrical, and plumbing contractor serving Greater Austin with 24/7 emergency service since 2007.",
    "primary_verticals": [
      "HVAC Services",
      "Heating Services",
      "Cooling Services",
      "Plumbing Services",
      "Electrical Services"
    ],
    "explicit_out_of_scope": [
      "Equipment Sales",
      "Parts Distribution",
      "Rentals",
      "DIY Solutions",
      "Non-Austin Service Areas"
    ]
  }
}`,
  logoUrlsJson: `{
  "favicon": "https://cdn.gushwork.ai/website/abbahvac-26qufs/assets/logo/favicon.ico",
  "gbp_url": "https://cdn.gushwork.ai/website/abbahvac-26qufs/assets/logo/1762346721939798_a86fafd2c21a4bc8a0c17218ef70acb4.webp",
  "primary_logo": "https://file-host.link/website/abbahvac-26qufs/assets/uploaded-assets/1765366762364000_6e39d050f2fc47d1b5363ec6bce5bb43"
}`,
  serviceCatalogJson: `[]`,
  productInformationJson: `[]`,
  paaDataJson: `{}`,
};

export const CLIENT_SAMPLES: ClientSample[] = [
  CLIENT_ALLCARE_MEDICAL_TRANSPORT,
  CLIENT_EVOK_POLYMERS,
  CLIENT_MOREX_RIBBON,
  CLIENT_PERFECT_IMPRINTS,
  CLIENT_POWELL_SYSTEMS_INC,
  CLIENT_ROSSINI_EQUIPMENT_CORP,
  CLIENT_SENTINEL_ASSET_MANAGEMENT,
  CLIENT_SYLUS,
  CLIENT_TERRAPIN_INDUSTRIAL_LLC,
  CLIENT_TRINU_POWDER_COATING,
  CLIENT_7BROWN,
  CLIENT_ABBAHVAC,
];

export function getClientSampleBySlug(slug: string): ClientSample | undefined {
  return CLIENT_SAMPLES.find((c) => c.slug === slug);
}
