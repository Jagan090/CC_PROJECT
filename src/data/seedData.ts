import {
  UserProfile,
  Course,
  SkillCompetency,
  UserSkillProficiency,
  Certificate,
  KnowledgeArticle,
  NotificationItem,
  ActivityLog,
  CourseEnrollment,
  AssessmentResult
} from '../types';

export const SEED_USERS: UserProfile[] = [
  {
    id: 'usr-emp-1',
    name: 'Jagan Sakthivel',
    email: 'jagansakthi45@gmail.com',
    role: 'employee',
    department: 'Platform Engineering',
    title: 'Senior DevOps Specialist',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    managerId: 'usr-mgr-1',
    joinedDate: '2023-04-15'
  },
  {
    id: 'usr-emp-2',
    name: 'Sarah Chen',
    email: 'sarah.chen@capacityconnect.corp',
    role: 'employee',
    department: 'Platform Engineering',
    title: 'Cloud Systems Associate',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    managerId: 'usr-mgr-1',
    joinedDate: '2024-01-10'
  },
  {
    id: 'usr-emp-3',
    name: 'Rohan Mehta',
    email: 'rohan.mehta@capacityconnect.corp',
    role: 'employee',
    department: 'Data & Analytics',
    title: 'Data Platform Engineer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    managerId: 'usr-mgr-1',
    joinedDate: '2023-09-01'
  },
  {
    id: 'usr-trn-1',
    name: 'Marcus Vance',
    email: 'marcus.vance@capacityconnect.corp',
    role: 'trainer',
    department: 'Technical Enablement',
    title: 'Principal Architect & Master Instructor',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    joinedDate: '2021-08-20'
  },
  {
    id: 'usr-mgr-1',
    name: 'Elena Rostova',
    email: 'elena.rostova@capacityconnect.corp',
    role: 'manager',
    department: 'Engineering & Technology',
    title: 'VP of Platform Engineering',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    joinedDate: '2020-03-01'
  },
  {
    id: 'usr-adm-1',
    name: 'David Kumar',
    email: 'david.kumar@capacityconnect.corp',
    role: 'admin',
    department: 'Global People & Organization',
    title: 'Chief Learning Officer & LMS Admin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    joinedDate: '2019-11-15'
  }
];

export const SEED_SKILLS: SkillCompetency[] = [
  {
    id: 'skill-cloud-arch',
    name: 'Cloud Infrastructure & Networking',
    category: 'Cloud & DevOps',
    description: 'Design of fault-tolerant, scalable virtual networks, compute clusters, and multi-region infrastructure.',
    targetProficiency: 85,
    recommendedCourseId: 'course-cloud-01'
  },
  {
    id: 'skill-k8s',
    name: 'Kubernetes & Container Orchestration',
    category: 'Cloud & DevOps',
    description: 'Production container scheduling, ingress routing, Helm chart packaging, and service mesh governance.',
    targetProficiency: 80,
    recommendedCourseId: 'course-k8s-02'
  },
  {
    id: 'skill-genai',
    name: 'Applied Generative AI & LLMOps',
    category: 'AI & Machine Learning',
    description: 'Integration of LLMs, vector database embeddings, Retrieval Augmented Generation (RAG), and prompt safety.',
    targetProficiency: 75,
    recommendedCourseId: 'course-ai-03'
  },
  {
    id: 'skill-cybersec',
    name: 'Zero-Trust Architecture & Threat Modeling',
    category: 'Cybersecurity & Governance',
    description: 'Identity perimeter security, cryptographic key lifecycle, vulnerability remediation, and IAM compliance.',
    targetProficiency: 80,
    recommendedCourseId: 'course-sec-04'
  },
  {
    id: 'skill-leadership',
    name: 'Agile Delivery & Technical Mentorship',
    category: 'Leadership & Agile',
    description: 'Cross-functional sprint cadences, OKR alignment, blameless post-mortems, and technical capacity growth.',
    targetProficiency: 75,
    recommendedCourseId: 'course-lead-05'
  },
  {
    id: 'skill-data-eng',
    name: 'Real-Time Streaming & Pipeline Engineering',
    category: 'Data Engineering',
    description: 'Distributed event bus architectures (Kafka), stream processing, data schemas, and analytics pipelines.',
    targetProficiency: 70,
    recommendedCourseId: 'course-data-06'
  }
];

export const SEED_COURSES: Course[] = [
  {
    id: 'course-cloud-01',
    title: 'Enterprise Multi-Region Cloud Architecture',
    description: 'Master mission-critical cloud networking, VPC peering, global load balancers, auto-healing topologies, and multi-region failover blueprints.',
    instructorId: 'usr-trn-1',
    instructorName: 'Marcus Vance',
    instructorRole: 'Principal Cloud Architect',
    category: 'Cloud & DevOps',
    difficulty: 'Advanced',
    durationHours: 6,
    thumbnailUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
    featured: true,
    rating: 4.9,
    enrolledCount: 142,
    createdAt: '2024-02-10',
    targetSkills: ['skill-cloud-arch'],
    modules: [
      {
        id: 'mod-c1-1',
        title: 'Global Ingress & Distributed Traffic Routing',
        durationMinutes: 45,
        description: 'Understand latency-based DNS routing, Anycast IP distribution, and edge SSL termination.',
        content: `### Global Ingress & Distributed Traffic Routing

When operating enterprise systems with sub-50ms latency expectations, traditional single-region deployments create severe bottlenecks and single points of failure.

#### Architectural Principles
1. **Anycast Edge Distribution**: Leverage BGP Anycast to announce the same IP address from hundreds of edge locations globally. Requests naturally resolve to the closest point of presence.
2. **Layer 7 Global Load Balancing**: Proxies route HTTP/S traffic based on URL path, geographical origin, and real-time backend health metrics.
3. **Cross-Region Replication**: Asynchronous read replicas with leader-elected regional failovers safeguard data integrity while maximizing read throughput.

\`\`\`
Client Inbound ──> Anycast Edge ──> Regional Envoy Gateway ──> Microservice Mesh
\`\`\`

#### Resiliency Checklist
* Health check interval under 5 seconds with exponential backoff.
* Cross-zone circuit breakers to isolate cascading failures.
* Synthetic canary traffic injecting simulated failures daily.`
      },
      {
        id: 'mod-c1-2',
        title: 'VPC Interconnects & Zero-Trust Subnets',
        durationMinutes: 50,
        description: 'Design non-overlapping CIDR blocks, private service connects, and transit gateway topologies.',
        content: `### VPC Interconnects & Zero-Trust Subnets

In an enterprise cloud setup, flat networks where any service can ping any other are a critical security liability.

#### Key Patterns
* **Hub-and-Spoke Topology**: Centralize egress firewalls and inspection appliances in a dedicated Transit VPC.
* **Non-Overlapping RFC 1918 CIDRs**: Carefully segment IP allocations across staging, production, and disaster recovery environments.
* **Private Service Connect**: Expose internal services directly without configuring public internet facing gateways.`
      },
      {
        id: 'mod-c1-3',
        title: 'Disaster Recovery (RTO & RPO Optimization)',
        durationMinutes: 40,
        description: 'Implement automated failover workflows to maintain RTO < 15 minutes and RPO < 1 minute.',
        content: `### Disaster Recovery Patterns

Every engineering organization must formalize clear **Recovery Time Objectives (RTO)** and **Recovery Point Objectives (RPO)**.

#### Tier Comparison:
* **Active-Passive (Warm Standby)**: Minimal core infrastructure running in secondary region; scales up upon health check failure. Low cost, RTO ~ 10 mins.
* **Active-Active (Multi-Region)**: Both regions continuously serve live user queries. Zero downtime failover, higher complexity and replication cost.

Continuous chaos testing (e.g. Chaos Monkey) is mandatory to ensure automatic DNS flips succeed in production.`
      }
    ],
    quiz: {
      id: 'quiz-cloud-01',
      courseId: 'course-cloud-01',
      title: 'Cloud Architecture & Multi-Region Competency Exam',
      passingScore: 70,
      targetSkillId: 'skill-cloud-arch',
      skillBoostPoints: 15,
      questions: [
        {
          id: 'q1-1',
          question: 'What is the primary advantage of utilizing BGP Anycast for edge load balancing?',
          options: [
            'It forces all incoming traffic to route to a single physical server',
            'Requests are automatically routed to the topologically closest edge location sharing the same IP address',
            'It eliminates the need for SSL/TLS certificates completely',
            'It reduces backend cloud compute costs by 90%'
          ],
          correctIndex: 1,
          explanation: 'BGP Anycast allows multiple global points of presence to advertise the exact same IP address, directing users to the nearest responsive location with minimal latency.'
        },
        {
          id: 'q1-2',
          question: 'What does an RTO of 15 minutes and RPO of 1 minute specify during a regional outage?',
          options: [
            'System can be down for 1 minute and may lose up to 15 minutes of transactional data',
            'System must be restored within 15 minutes, with a maximum data loss window of 1 minute',
            'Data backup occurs every 15 minutes',
            'Servers will restart every 1 minute for security auditing'
          ],
          correctIndex: 1,
          explanation: 'RTO (Recovery Time Objective) defines the acceptable downtime duration (15 min), while RPO (Recovery Point Objective) defines the maximum allowable data loss window (1 min).'
        },
        {
          id: 'q1-3',
          question: 'In a Zero-Trust network architecture, what policy dictates service communication?',
          options: [
            'Implicit trust is granted to all traffic originating inside the internal corporate intranet',
            'Every request must be authenticated, authorized, and cryptographically verified regardless of network perimeter',
            'Only external API requests require token validation',
            'Firewalls are disabled in favor of client passwords'
          ],
          correctIndex: 1,
          explanation: 'Zero-Trust operates on the rule of "never trust, always verify" — every internal microservice call must authenticate and prove authorization.'
        }
      ]
    }
  },
  {
    id: 'course-k8s-02',
    title: 'Production Kubernetes & GitOps Orchestration',
    description: 'Deploy resilient microservices with Helm, ArgoCD, automated pod autoscaling (HPA/KEDA), and Istio service mesh security.',
    instructorId: 'usr-trn-1',
    instructorName: 'Marcus Vance',
    instructorRole: 'Principal Cloud Architect',
    category: 'Cloud & DevOps',
    difficulty: 'Intermediate',
    durationHours: 5,
    thumbnailUrl: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&auto=format&fit=crop&q=80',
    featured: true,
    rating: 4.8,
    enrolledCount: 198,
    createdAt: '2024-01-15',
    targetSkills: ['skill-k8s'],
    modules: [
      {
        id: 'mod-c2-1',
        title: 'Kubernetes Core Architecture & Scheduling Controls',
        durationMinutes: 40,
        description: 'Control-plane mechanics, kube-scheduler affinity rules, taints, tolerations, and resource limits.',
        content: `### Kubernetes Scheduling & Production Controls

Pods without declared resource requests and limits are "burstable" risks that can starve critical system daemons on Kubernetes nodes.

#### Key Practices:
1. **Always Set CPU & Memory Requests/Limits**: Requests define what the scheduler guarantees; limits define OOM-kill boundaries.
2. **Node Affinity & Anti-Affinity**: Prevent single-node concentration by spreading replicas across distinct availability zones:
\`\`\`yaml
topologySpreadConstraints:
  - maxSkew: 1
    topologyKey: topology.kubernetes.io/zone
    whenUnsatisfiable: DoNotSchedule
    labelSelector:
      matchLabels:
        app: api-gateway
\`\`\`
3. **Pod Disruption Budgets (PDB)**: Guarantee at least N pods stay alive during cluster node upgrades.`
      },
      {
        id: 'mod-c2-2',
        title: 'GitOps Continuous Delivery with ArgoCD',
        durationMinutes: 50,
        description: 'Eliminate manual kubectl commands with declarative repository-as-truth deployments.',
        content: `### GitOps & Declarative Delivery

GitOps mandates that Git is the sole source of truth for the desired system state.

#### Workflow Benefits
* **Audit Trail**: Every cluster state change is a reviewed, signed Git commit.
* **Self-Healing**: If a developer changes a configuration imperatively in production, ArgoCD automatically drifts back to the committed Git state.
* **Instant Rollbacks**: Reverting a failed deployment requires only a \`git revert\` on the main branch.`
      }
    ],
    quiz: {
      id: 'quiz-k8s-02',
      courseId: 'course-k8s-02',
      title: 'Kubernetes Production Engineering Assessment',
      passingScore: 70,
      targetSkillId: 'skill-k8s',
      skillBoostPoints: 15,
      questions: [
        {
          id: 'q2-1',
          question: 'What happens to a container that exceeds its configured memory limit in Kubernetes?',
          options: [
            'It is throttled down to 50% CPU',
            'It is terminated by the kernel with an OOMKilled (Out of Memory) signal and restarted by kubelet',
            'Additional swap memory is dynamically provisioned from the host machine',
            'The request is queued until memory becomes free'
          ],
          correctIndex: 1,
          explanation: 'When a container consumes more memory than its limit, Linux cgroups trigger the OOM killer, terminating the container with exit code 137 (OOMKilled).'
        },
        {
          id: 'q2-2',
          question: 'In a GitOps continuous delivery model managed by ArgoCD, what is the single source of truth?',
          options: [
            'The local developer laptop terminal',
            'The Git repository containing declarative manifests',
            'The live in-memory etcd cluster state',
            'The Slack deployment bot'
          ],
          correctIndex: 1,
          explanation: 'GitOps dictates that the Git repository holds the canonical desired state, and controllers continuously sync the live cluster to match it.'
        }
      ]
    }
  },
  {
    id: 'course-ai-03',
    title: 'Applied Generative AI & Enterprise RAG Systems',
    description: 'Design production-grade Retrieval-Augmented Generation systems with vector embeddings, semantic rerankers, and guardrail protections.',
    instructorId: 'usr-trn-1',
    instructorName: 'Marcus Vance',
    instructorRole: 'Principal Cloud Architect',
    category: 'AI & Machine Learning',
    difficulty: 'Intermediate',
    durationHours: 7,
    thumbnailUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=80',
    featured: true,
    rating: 4.95,
    enrolledCount: 265,
    createdAt: '2024-03-01',
    targetSkills: ['skill-genai'],
    modules: [
      {
        id: 'mod-c3-1',
        title: 'Vector Embeddings, Chunking Strategies & Hybrid Search',
        durationMinutes: 45,
        description: 'Document ingestion pipelines, semantic chunking, and combining BM25 keyword matching with dense vector similarity.',
        content: `### Enterprise Document Chunking & Ingestion

Naively splitting documents every 500 characters breaks table semantics, markdown headers, and code snippets, ruining retrieval accuracy.

#### Recommended Ingestion Pipeline
1. **Semantic Chunking**: Split by section headers, maintaining contextual metadata (e.g. document title, page number, author) in chunk prefixes.
2. **Hybrid Search (Sparse + Dense)**: Combine sparse lexical search (BM25 for exact acronyms, codes, and IDs) with dense cosine vector similarity (for conceptual meaning).
3. **Cross-Encoder Reranking**: Take the top 50 candidates from hybrid retrieval and score them with a cross-encoder model to surface the top 5 most relevant passages before prompting the LLM.`
      },
      {
        id: 'mod-c3-2',
        title: 'Hallucination Mitigation & Output Guardrails',
        durationMinutes: 50,
        description: 'Evaluate groundedness, citation verification, and automated prompt injection defense.',
        content: `### Guardrails & Evaluation Metrics

To deploy GenAI in enterprise compliance scenarios, strict guardrails are necessary.

#### Evaluation Framework (RAG Triad):
* **Context Relevance**: Are the retrieved chunks relevant to the user query?
* **Groundedness**: Is the generated answer supported purely by the retrieved context?
* **Answer Relevance**: Does the final response directly answer the user prompt without tangent?

Always implement automated system checks to strip PII and block jailbreak attempts before tokens reach the foundation model.`
      }
    ],
    quiz: {
      id: 'quiz-ai-03',
      courseId: 'course-ai-03',
      title: 'Enterprise RAG & LLMOps Certification Quiz',
      passingScore: 70,
      targetSkillId: 'skill-genai',
      skillBoostPoints: 20,
      questions: [
        {
          id: 'q3-1',
          question: 'Why is Hybrid Search (combining BM25 and vector embeddings) preferred over vector search alone in enterprise RAG?',
          options: [
            'Vector search cannot understand natural language English',
            'Dense vectors often struggle with exact product serial codes, part numbers, and niche acronyms where BM25 excels',
            'Hybrid search reduces vector database storage space by 80%',
            'BM25 eliminates the need for embedding models'
          ],
          correctIndex: 1,
          explanation: 'Dense vector embeddings excel at broad conceptual semantics, but fail on precise identifiers, error codes, and unique strings where keyword search (BM25) is exact.'
        },
        {
          id: 'q3-2',
          question: 'In the RAG Triad evaluation framework, what does "Groundedness" measure?',
          options: [
            'The speed at which the API generates the first token',
            'Whether all claims in the model response are backed by facts present in the retrieved context',
            'The total number of documents indexed in the vector database',
            'Whether the user prompt contained polite greeting language'
          ],
          correctIndex: 1,
          explanation: 'Groundedness tests whether the generated answer is faithful to the context without hallucinations or fabricated external facts.'
        }
      ]
    }
  },
  {
    id: 'course-sec-04',
    title: 'Zero-Trust Architecture & Threat Modeling',
    description: 'Protect distributed enterprise networks: mTLS, automated credential rotation, OWASP API security, and least-privilege IAM policies.',
    instructorId: 'usr-trn-1',
    instructorName: 'Marcus Vance',
    instructorRole: 'Principal Cloud Architect',
    category: 'Cybersecurity & Governance',
    difficulty: 'Intermediate',
    durationHours: 4,
    thumbnailUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80',
    rating: 4.88,
    enrolledCount: 110,
    createdAt: '2024-02-25',
    targetSkills: ['skill-cybersec'],
    modules: [
      {
        id: 'mod-c4-1',
        title: 'Mutual TLS (mTLS) & Service Mesh Identity',
        durationMinutes: 45,
        description: 'SPIFFE/SPIRE identity standards, short-lived X.509 certs, and microservice cryptographic handshakes.',
        content: `### Mutual TLS (mTLS) in Microservices

Standard TLS only validates the server identity to the client. Zero-Trust requires **mTLS**, where the server also cryptographically validates the client identity.

#### Key Concepts:
* **SPIFFE ID**: Standardized URI formatted as \`spiffe://domain/ns/prod/sa/order-service\`.
* **Ephemeral Certificates**: Issue X.509 certificates with lifetimes as short as 12 hours, automatically rotated by the service mesh daemon.
* **No Hardcoded Secrets**: Services authenticate via kernel identity probes rather than static API keys stored in environment variables.`
      }
    ],
    quiz: {
      id: 'quiz-sec-04',
      courseId: 'course-sec-04',
      title: 'Zero-Trust Security Competency Assessment',
      passingScore: 70,
      targetSkillId: 'skill-cybersec',
      skillBoostPoints: 15,
      questions: [
        {
          id: 'q4-1',
          question: 'What is the critical operational difference between standard TLS and Mutual TLS (mTLS)?',
          options: [
            'TLS encrypts traffic while mTLS transmits data in plaintext',
            'In mTLS, both client and server present and verify digital certificates to establish reciprocal authentication',
            'TLS requires an internet connection whereas mTLS only runs offline',
            'mTLS replaces the need for firewall subnets'
          ],
          correctIndex: 1,
          explanation: 'mTLS mandates bidirectional verification: the client proves who it is to the server, and the server proves who it is to the client.'
        }
      ]
    }
  },
  {
    id: 'course-lead-05',
    title: 'Strategic Agile Leadership & Engineering Velocity',
    description: 'Empower high-performing engineering teams with blameless post-mortems, DORA metrics, capacity planning, and technical career ladders.',
    instructorId: 'usr-trn-1',
    instructorName: 'Marcus Vance',
    instructorRole: 'Principal Cloud Architect',
    category: 'Leadership & Agile',
    difficulty: 'Beginner',
    durationHours: 3.5,
    thumbnailUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80',
    rating: 4.75,
    enrolledCount: 165,
    createdAt: '2024-01-20',
    targetSkills: ['skill-leadership'],
    modules: [
      {
        id: 'mod-c5-1',
        title: 'The 4 Key DORA Metrics for Engineering Excellence',
        durationMinutes: 35,
        description: 'Deployment Frequency, Lead Time for Changes, Time to Restore Service, and Change Failure Rate.',
        content: `### Measuring Velocity with DORA Metrics

Instead of tracking meaningless vanity metrics like "lines of code" or raw story points, elite engineering organizations measure the 4 DORA metrics:

1. **Deployment Frequency**: How often code successfully deploys to production.
2. **Lead Time for Changes**: Time elapsed from code commit to running in production.
3. **Change Failure Rate**: Percentage of deployments causing a production degradation requiring rollback.
4. **Time to Restore Service (MTTR)**: How fast the team restores normal service when an incident occurs.`
      }
    ],
    quiz: {
      id: 'quiz-lead-05',
      courseId: 'course-lead-05',
      title: 'Agile & Team Leadership Assessment',
      passingScore: 70,
      targetSkillId: 'skill-leadership',
      skillBoostPoints: 15,
      questions: [
        {
          id: 'q5-1',
          question: 'Which of the following is one of the four foundational DORA metrics?',
          options: [
            'Total Lines of Code written per sprint',
            'Deployment Frequency',
            'Number of daily meetings attended',
            'Jira tickets assigned per developer'
          ],
          correctIndex: 1,
          explanation: 'Deployment Frequency measures how often working software is pushed to production, reflecting team agility and automated testing confidence.'
        }
      ]
    }
  },
  {
    id: 'course-data-06',
    title: 'Real-Time Streaming with Apache Kafka & Flink',
    description: 'Build enterprise event-driven architectures: Kafka partitioning, exactly-once semantics (EOS), consumer groups, and stream windowing.',
    instructorId: 'usr-trn-1',
    instructorName: 'Marcus Vance',
    instructorRole: 'Principal Cloud Architect',
    category: 'Data Engineering',
    difficulty: 'Advanced',
    durationHours: 6,
    thumbnailUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80',
    rating: 4.82,
    enrolledCount: 88,
    createdAt: '2024-03-10',
    targetSkills: ['skill-data-eng'],
    modules: [
      {
        id: 'mod-c6-1',
        title: 'Kafka Partitioning & Parallelism Mechanics',
        durationMinutes: 45,
        description: 'Understanding partition key hashing, rebalancing protocols, and consumer group scaling.',
        content: `### Kafka Partitions & Scale

A Kafka topic is divided into partitions, which are the fundamental unit of parallelism.

* **Key-Based Ordering**: Messages sharing the same non-null key are guaranteed to land on the same partition, preserving strict chronological ordering.
* **Consumer Group Ceiling**: You cannot have more active consumers in a single group than there are partitions in the subscribed topic; excess consumers sit idle as hot standbys.`
      }
    ],
    quiz: {
      id: 'quiz-data-06',
      courseId: 'course-data-06',
      title: 'Event Streaming & Kafka Mastery Quiz',
      passingScore: 70,
      targetSkillId: 'skill-data-eng',
      skillBoostPoints: 15,
      questions: [
        {
          id: 'q6-1',
          question: 'If a Kafka topic has 6 partitions, what is the maximum number of consumers in a single consumer group that can actively read concurrently?',
          options: [
            '12 consumers',
            '6 consumers',
            'Unlimited consumers',
            'Only 1 consumer'
          ],
          correctIndex: 1,
          explanation: 'Each partition can be assigned to at most one consumer instance within a consumer group at any given time.'
        }
      ]
    }
  },
  {
    id: 'course-react-07',
    title: 'Modern Full-Stack React 19 & Architecture',
    description: 'Production React 19 patterns: React Server Components, Suspense streaming, optimistic updates, and clean state machines.',
    instructorId: 'usr-trn-1',
    instructorName: 'Marcus Vance',
    instructorRole: 'Principal Cloud Architect',
    category: 'Full-Stack Development',
    difficulty: 'Intermediate',
    durationHours: 4.5,
    thumbnailUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=80',
    rating: 4.91,
    enrolledCount: 220,
    createdAt: '2024-02-18',
    targetSkills: ['skill-cloud-arch'],
    modules: [
      {
        id: 'mod-c7-1',
        title: 'React Server Components & Zero-Bundle Architecture',
        durationMinutes: 40,
        description: 'Execute database queries on the server without shipping dependencies to the client browser.',
        content: `### React Server Components (RSC)

Server Components allow developers to build modern applications that span both server and client boundaries seamlessly.

#### Core Advantages:
* **Zero Client Bundle Size**: Heavy dependencies like markdown parsers or date libraries run solely on the server.
* **Direct Backend Access**: Query databases and caches directly without spinning up REST boilerplate.
* **Streamed HTML**: Stream components over the wire as soon as their asynchronous data promises resolve.`
      }
    ],
    quiz: {
      id: 'quiz-react-07',
      courseId: 'course-react-07',
      title: 'React 19 Architecture Assessment',
      passingScore: 70,
      targetSkillId: 'skill-cloud-arch',
      skillBoostPoints: 10,
      questions: [
        {
          id: 'q7-1',
          question: 'What is a key performance benefit of React Server Components (RSC)?',
          options: [
            'They eliminate the need for CSS',
            'Dependencies used exclusively in Server Components add 0 bytes to the client JavaScript bundle',
            'They disable React state hooks entirely',
            'They make all web pages static HTML without interactivity'
          ],
          correctIndex: 1,
          explanation: 'Server Components execute only on the server, meaning their npm dependencies are not shipped to client browsers.'
        }
      ]
    }
  },
  {
    id: 'course-finops-08',
    title: 'Cloud FinOps & Infrastructure Cost Governance',
    description: 'Learn enterprise cost allocation tags, spot instance strategies, right-sizing algorithms, and commitment management.',
    instructorId: 'usr-trn-1',
    instructorName: 'Marcus Vance',
    instructorRole: 'Principal Cloud Architect',
    category: 'Cloud & DevOps',
    difficulty: 'Intermediate',
    durationHours: 3,
    thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
    rating: 4.7,
    enrolledCount: 95,
    createdAt: '2024-03-05',
    targetSkills: ['skill-cloud-arch'],
    modules: [
      {
        id: 'mod-c8-1',
        title: 'Cost Allocation Tagging & Waste Identification',
        durationMinutes: 30,
        description: 'Audit idle persistent volumes, unattached static IPs, and unutilized reserved capacity.',
        content: `### Cloud FinOps Framework

The FinOps foundation defines a 3-phase journey: **Inform**, **Optimize**, and **Operate**.

#### Immediate Waste Killers:
* Delete unattached EBS / Persistent Disks left after cluster teardowns.
* Standardize automated non-production instance shutdowns during weekends and evenings.
* Leverage 3-year savings plans for baseline compute workloads.`
      }
    ],
    quiz: {
      id: 'quiz-finops-08',
      courseId: 'course-finops-08',
      title: 'FinOps Fundamentals Exam',
      passingScore: 70,
      targetSkillId: 'skill-cloud-arch',
      skillBoostPoints: 10,
      questions: [
        {
          id: 'q8-1',
          question: 'What is the primary goal of Cloud FinOps in an enterprise organization?',
          options: [
            'To stop spending money on cloud services altogether',
            'To drive financial accountability and maximize business value derived from cloud investments',
            'To replace engineers with financial accountants',
            'To migrate all workloads back to on-premise physical servers'
          ],
          correctIndex: 1,
          explanation: 'FinOps is about enabling teams to make informed trade-offs between speed, cost, and quality to maximize business ROI.'
        }
      ]
    }
  }
];

export const SEED_USER_SKILLS: Record<string, UserSkillProficiency[]> = {
  'usr-emp-1': [
    {
      skillId: 'skill-cloud-arch',
      skillName: 'Cloud Infrastructure & Networking',
      category: 'Cloud & DevOps',
      currentProficiency: 72,
      targetProficiency: 85,
      gap: 13,
      lastAssessedAt: '2024-03-01'
    },
    {
      skillId: 'skill-k8s',
      skillName: 'Kubernetes & Container Orchestration',
      category: 'Cloud & DevOps',
      currentProficiency: 65,
      targetProficiency: 80,
      gap: 15,
      lastAssessedAt: '2024-02-15'
    },
    {
      skillId: 'skill-genai',
      skillName: 'Applied Generative AI & LLMOps',
      category: 'AI & Machine Learning',
      currentProficiency: 40,
      targetProficiency: 75,
      gap: 35,
      lastAssessedAt: '2024-01-20'
    },
    {
      skillId: 'skill-cybersec',
      skillName: 'Zero-Trust Architecture & Threat Modeling',
      category: 'Cybersecurity & Governance',
      currentProficiency: 78,
      targetProficiency: 80,
      gap: 2,
      lastAssessedAt: '2024-03-04'
    },
    {
      skillId: 'skill-leadership',
      skillName: 'Agile Delivery & Technical Mentorship',
      category: 'Leadership & Agile',
      currentProficiency: 82,
      targetProficiency: 75,
      gap: 0,
      lastAssessedAt: '2024-02-28'
    },
    {
      skillId: 'skill-data-eng',
      skillName: 'Real-Time Streaming & Pipeline Engineering',
      category: 'Data Engineering',
      currentProficiency: 50,
      targetProficiency: 70,
      gap: 20,
      lastAssessedAt: '2024-01-15'
    }
  ],
  'usr-emp-2': [
    {
      skillId: 'skill-cloud-arch',
      skillName: 'Cloud Infrastructure & Networking',
      category: 'Cloud & DevOps',
      currentProficiency: 55,
      targetProficiency: 85,
      gap: 30,
      lastAssessedAt: '2024-02-10'
    },
    {
      skillId: 'skill-k8s',
      skillName: 'Kubernetes & Container Orchestration',
      category: 'Cloud & DevOps',
      currentProficiency: 50,
      targetProficiency: 80,
      gap: 30,
      lastAssessedAt: '2024-02-10'
    },
    {
      skillId: 'skill-genai',
      skillName: 'Applied Generative AI & LLMOps',
      category: 'AI & Machine Learning',
      currentProficiency: 70,
      targetProficiency: 75,
      gap: 5,
      lastAssessedAt: '2024-03-02'
    },
    {
      skillId: 'skill-cybersec',
      skillName: 'Zero-Trust Architecture & Threat Modeling',
      category: 'Cybersecurity & Governance',
      currentProficiency: 60,
      targetProficiency: 80,
      gap: 20,
      lastAssessedAt: '2024-01-18'
    },
    {
      skillId: 'skill-leadership',
      skillName: 'Agile Delivery & Technical Mentorship',
      category: 'Leadership & Agile',
      currentProficiency: 65,
      targetProficiency: 75,
      gap: 10,
      lastAssessedAt: '2024-02-01'
    },
    {
      skillId: 'skill-data-eng',
      skillName: 'Real-Time Streaming & Pipeline Engineering',
      category: 'Data Engineering',
      currentProficiency: 75,
      targetProficiency: 70,
      gap: 0,
      lastAssessedAt: '2024-03-01'
    }
  ]
};

export const SEED_ENROLLMENTS: CourseEnrollment[] = [
  {
    id: 'enr-1',
    userId: 'usr-emp-1',
    courseId: 'course-cloud-01',
    enrolledAt: '2024-02-12',
    completedModuleIds: ['mod-c1-1', 'mod-c1-2'],
    progressPercent: 66,
    status: 'in_progress',
    lastAccessedAt: '2024-03-06'
  },
  {
    id: 'enr-2',
    userId: 'usr-emp-1',
    courseId: 'course-k8s-02',
    enrolledAt: '2024-01-18',
    completedModuleIds: ['mod-c2-1'],
    progressPercent: 50,
    status: 'in_progress',
    lastAccessedAt: '2024-03-04'
  },
  {
    id: 'enr-3',
    userId: 'usr-emp-1',
    courseId: 'course-lead-05',
    enrolledAt: '2024-01-25',
    completedModuleIds: ['mod-c5-1'],
    progressPercent: 100,
    status: 'completed',
    completedAt: '2024-02-28',
    lastAccessedAt: '2024-02-28'
  },
  {
    id: 'enr-4',
    userId: 'usr-emp-2',
    courseId: 'course-ai-03',
    enrolledAt: '2024-03-02',
    completedModuleIds: ['mod-c3-1'],
    progressPercent: 50,
    status: 'in_progress',
    lastAccessedAt: '2024-03-05'
  }
];

export const SEED_CERTIFICATES: Certificate[] = [
  {
    id: 'cert-001',
    certificateNumber: 'CAP-2024-88412',
    userId: 'usr-emp-1',
    userName: 'Jagan Sakthivel',
    courseId: 'course-lead-05',
    courseTitle: 'Strategic Agile Leadership & Engineering Velocity',
    instructorName: 'Marcus Vance',
    issueDate: '2024-02-28',
    verificationHash: '9a7f3c2b-e14d-4a8f-8d9e-5b6c7a8b9c0d',
    finalScore: 92
  }
];

export const SEED_ARTICLES: KnowledgeArticle[] = [
  {
    id: 'art-1',
    title: 'Enterprise Blueprint: Production VPC Peering & Transit Gateways',
    category: 'Cloud & Infrastructure',
    summary: 'A step-by-step guide to avoiding overlapping CIDRs and connecting multi-account AWS/GCP workloads through managed transit routers.',
    readTimeMinutes: 7,
    author: 'Marcus Vance',
    tags: ['Cloud', 'VPC', 'Networking', 'Architecture'],
    publishedAt: '2024-02-14',
    content: `## Executive Overview

As enterprise cloud footprints grow across multiple business units, managing point-to-point VPC peering quickly degenerates into an unmaintainable full mesh with N*(N-1)/2 connections.

### Core Recommendations
1. **Centralize with Transit Gateway (TGW)**: Use a hub-and-spoke transit gateway with separate route tables for production, non-production, and shared services.
2. **IP Address Management (IPAM)**: Enforce a strict hierarchical CIDR allocation policy (e.g. 10.100.0.0/16 for EMEA, 10.200.0.0/16 for APAC).
3. **Egress Filtering**: Route all outbound internet traffic through an inspection VPC housing stateful next-generation firewalls.`
  },
  {
    id: 'art-2',
    title: 'Zero-Downtime Database Migrations with Schema Versioning',
    category: 'Backend & Data',
    summary: 'Best practices for the Expand-Contract pattern when changing production schemas without taking client services offline.',
    readTimeMinutes: 6,
    author: 'Elena Rostova',
    tags: ['Database', 'PostgreSQL', 'Reliability', 'Migrations'],
    publishedAt: '2024-02-22',
    content: `## The Expand and Contract Pattern

Directly renaming or dropping a database column during active deployment causes instant 500 errors for any client code running the previous version.

### Execution Phases:
* **Phase 1 (Expand)**: Add the new column or table. Keep the old one active. Both old and new code write to both columns via dual-writing or database triggers.
* **Phase 2 (Backfill)**: Run asynchronous batch scripts to copy historical records from old columns to new columns without table locks.
* **Phase 3 (Contract)**: Deprecate the old column once 100% of production traffic reads and writes strictly to the new schema.`
  },
  {
    id: 'art-3',
    title: 'Prompt Injection Defense & Guardrail Ensembles for LLM Apps',
    category: 'AI & Security',
    summary: 'Techniques for securing enterprise copilots against direct and indirect prompt injections, jailbreaks, and sensitive data leakage.',
    readTimeMinutes: 9,
    author: 'Marcus Vance',
    tags: ['GenAI', 'Security', 'LLMOps', 'Prompt Engineering'],
    publishedAt: '2024-03-01',
    content: `## The Threat Surface of Enterprise LLMs

Untrusted user input can manipulate model context instructions, resulting in unauthorized data exfiltration or unintended tool executions.

### Dual-Layer Guardrail Architecture:
1. **Input Inspection**: Run lightweight classification models to flag adversarial strings before they hit the generation pipeline.
2. **Context Delimitation**: Use XML or Markdown boundaries (e.g. \`<retrieved_documents>\`) with explicit instruction to treat everything inside as data, never instructions.
3. **Output Hallucination Scorer**: Score output text for groundedness against reference citations.`
  },
  {
    id: 'art-4',
    title: 'Building Blameless Incident Culture & Post-Mortems',
    category: 'Leadership & Culture',
    summary: 'How treating human error as a symptom rather than a cause fosters systemic resilience and psychological safety in high-stakes environments.',
    readTimeMinutes: 5,
    author: 'David Kumar',
    tags: ['Culture', 'SRE', 'Agile', 'Leadership'],
    publishedAt: '2024-01-30',
    content: `## Blameless Philosophy

If a single engineer typing a command can take down the entire corporate billing service, the problem is not that engineer's carelessness — the problem is the lack of systemic guardrails, automated canaries, and blast-radius controls.

### 5 Questions Every Post-Mortem Must Answer:
1. What was the exact sequence of events leading to detection?
2. What alerts or telemetry fired, and what was missed?
3. What prevented faster mitigation?
4. What architectural change prevents this entire class of failure?
5. Who owns each action item with a strict due date?`
  }
];

export const SEED_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    userId: 'usr-emp-1',
    title: 'New Course Assigned',
    message: 'Your manager Elena Rostova assigned "Applied Generative AI & Enterprise RAG Systems" to address current skill gap.',
    type: 'assignment',
    read: false,
    createdAt: '2024-03-06T09:30:00Z',
    actionUrl: 'courses'
  },
  {
    id: 'notif-2',
    userId: 'usr-emp-1',
    title: 'Certificate Issued! 🎓',
    message: 'Congratulations! You earned the Strategic Agile Leadership & Engineering Velocity certification.',
    type: 'certificate',
    read: true,
    createdAt: '2024-02-28T16:45:00Z',
    actionUrl: 'certificates'
  },
  {
    id: 'notif-3',
    userId: 'usr-emp-1',
    title: 'Quarterly Assessment Due',
    message: 'Cloud Infrastructure & Networking proficiency benchmark check is due by the end of this sprint.',
    type: 'deadline',
    read: false,
    createdAt: '2024-03-05T11:00:00Z',
    actionUrl: 'assessments'
  }
];

export const SEED_ACTIVITIES: ActivityLog[] = [
  {
    id: 'act-1',
    userId: 'usr-emp-1',
    userName: 'Jagan Sakthivel',
    userRole: 'employee',
    action: 'Completed Module',
    detail: 'Completed "VPC Interconnects & Zero-Trust Subnets" in Cloud Architecture course',
    timestamp: '2 hours ago',
    iconType: 'complete'
  },
  {
    id: 'act-2',
    userId: 'usr-emp-2',
    userName: 'Sarah Chen',
    userRole: 'employee',
    action: 'Passed Assessment',
    detail: 'Scored 94% on Enterprise RAG & LLMOps Certification Quiz',
    timestamp: '5 hours ago',
    iconType: 'quiz'
  },
  {
    id: 'act-3',
    userId: 'usr-mgr-1',
    userName: 'Elena Rostova',
    userRole: 'manager',
    action: 'Assigned Training',
    detail: 'Assigned "Enterprise RAG Systems" to 3 Platform Engineering team members',
    timestamp: '1 day ago',
    iconType: 'assign'
  },
  {
    id: 'act-4',
    userId: 'usr-emp-1',
    userName: 'Jagan Sakthivel',
    userRole: 'employee',
    action: 'Earned Certificate',
    detail: 'Awarded Certificate #CAP-2024-88412 for Strategic Agile Leadership',
    timestamp: '6 days ago',
    iconType: 'cert'
  }
];
