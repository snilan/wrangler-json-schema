import { Type as T } from "@sinclair/typebox"
import { promises as fs } from "node:fs"

const Route = T.Union([
  T.String(),
  T.Object({
    pattern: T.String(),
    zone_id: T.String(),
    custom_domain: T.Optional(T.Boolean()),
  }),
  T.Object({
    pattern: T.String(),
    zone_name: T.String(),
    custom_domain: T.Optional(T.Boolean()),
  }),
  T.Object({
    pattern: T.String(),
    custom_domain: T.Optional(T.Boolean()),
  }),
])

const Rule = T.Object({
  type: T.Union([
    T.Literal("ESModule"),
    T.Literal("CommonJS"),
    T.Literal("CompiledWasm"),
    T.Literal("Text"),
    T.Literal("Data"),
  ]),
  globs: T.Array(T.String()),
  fallthrough: T.Optional(T.Boolean()),
})

const CustomBuild = T.Object({
  command: T.String(),
  cwd: T.Optional(T.String()),
  watch_dir: T.Optional(T.Union([T.String(), T.Array(T.String())])),
})

const DevelopmentSettings = T.Object({
  ip: T.Optional(T.String()),
  port: T.Optional(T.Number()),
  local_protocol: T.Optional(
    T.Union([T.Literal("http"), T.Literal("https")])
  ),
  upstream_protocol: T.Optional(
    T.Union([T.Literal("http"), T.Literal("https")])
  ),
  host: T.Optional(T.String()),
})

const D1Binding = T.Object({
  binding: T.String(),
  database_name: T.String(),
  database_id: T.String(),
  preview_database_id: T.Optional(T.String()),
})

const DurableObjectBinding = T.Object({
  name: T.String(),
  class_name: T.String(),
  script_name: T.Optional(T.String()),
  environment: T.Optional(T.String()),
})

const DurableObjectMigration = T.Object({
  tag: T.String(),
  new_classes: T.Optional(T.Array(T.String())),
  renamed_classes: T.Optional(
    T.Array(
      T.Object({
        from: T.String(),
        to: T.String(),
      })
    )
  ),
  deleted_classes: T.Optional(T.Array(T.String())),
})

const KVBinding = T.Object({
  binding: T.String(),
  id: T.String(),
  preview_id: T.Optional(T.String()),
})

const R2BucketBinding = T.Object({
  binding: T.String(),
  bucket_name: T.String(),
  preview_bucket_name: T.Optional(T.String()),
})

const ServiceBinding = T.Object({
  binding: T.String(),
  service: T.String(),
  environment: T.Optional(T.String()),
})

const TailConsumerBinding = T.Omit(ServiceBinding, ["binding"])

const QueueProducerBinding = T.Object({
  binding: T.String(),
  queue: T.String(),
})

const QueueConsumerBinding = T.Object({
  queue: T.String(),
  max_batch_size: T.Optional(T.Number()),
  max_batch_timeout: T.Optional(T.Number()),
  max_retries: T.Optional(T.Number()),
  dead_letter_queue: T.Optional(T.String()),
  max_concurrency: T.Optional(T.Number()),
})

const AnalyticsEngineDatasetBinding = T.Object({
  binding: T.String(),
  dataset: T.Optional(T.String()),
})

const MTLSCertificateBinding = T.Object({
  binding: T.String(),
  certificate_id: T.String(),
})

const SendEmailBinding = T.Union([
  T.Object({
    type: T.Literal("send_email"),
    name: T.String(),
    desination_address: T.String(),
  }),
  T.Object({
    type: T.Literal("send_email"),
    name: T.String(),
    allowed_destination_addresses: T.Array(T.String()),
  }),
])

const ConstellationBinding = T.Object({
  binding: T.String(),
  project_id: T.String(),
})

const BrowserBinding = T.Object({
  binding: T.String(),
  type: T.Literal("browser"),
})

const DispatchNamespace = T.Object({
  binding: T.String(),
  namespace: T.String(),
  outbound: T.Optional(
    T.Object({
      service: T.String(),
      parameters: T.Array(T.String()),
    })
  ),
})

const WorkerSite = T.Object({
  bucket: T.String(),
  include: T.Optional(T.Array(T.String())),
  exclude: T.Optional(T.Array(T.String())),
})

const WorkerConfig = T.Recursive((Config) =>
  T.Object({
    name: T.String(),
    main: T.String(),
    compatibility_date: T.Union([T.String(), T.Date()]),
    account_id: T.Optional(T.String()),
    compatibility_flags: T.Optional(T.Array(T.String())),
    workers_dev: T.Optional(T.Boolean()),
    route: T.Optional(Route),
    routes: T.Optional(T.Array(Route)),
    tsconfig: T.Optional(T.String()),
    triggers: T.Optional(
      T.Object({
        crons: T.Array(T.String()),
      })
    ),
    usage_model: T.Optional(
      T.Union([T.Literal("Bundled"), T.Literal("Unbound")])
    ),
    rules: T.Optional(T.Array(Rule)),
    build: T.Optional(CustomBuild),
    no_bundle: T.Optional(T.Boolean()),
    minify: T.Optional(T.Boolean()),
    node_compat: T.Optional(T.Boolean()),
    send_metrics: T.Optional(T.Boolean()),
    keep_vars: T.Optional(T.Boolean()),
    logpush: T.Optional(T.Boolean()),
    define: T.Optional(T.Record(T.String(), T.String())),
    vars: T.Optional(T.Record(T.String(), T.String())),
    d1_databases: T.Optional(T.Array(D1Binding)),
    durable_objects: T.Optional(T.Array(DurableObjectBinding)),
    migrations: T.Optional(T.Array(DurableObjectMigration)),
    kv_namespaces: T.Optional(T.Array(KVBinding)),
    r2_buckets: T.Optional(T.Array(R2BucketBinding)),
    services: T.Optional(T.Array(ServiceBinding)),
    queues: T.Optional(
      T.Object({
        producers: T.Optional(T.Array(QueueProducerBinding)),
        consumers: T.Optional(T.Array(QueueConsumerBinding)),
      })
    ),
    analytics_engine_datasets: T.Optional(
      T.Array(AnalyticsEngineDatasetBinding)
    ),
    mlts_certificates: T.Optional(T.Array(MTLSCertificateBinding)),
    send_email: T.Optional(T.Array(SendEmailBinding)),
    tail_consumers: T.Optional(T.Array(TailConsumerBinding)),
    constellation: T.Optional(T.Array(ConstellationBinding)),
    browser: T.Optional(BrowserBinding),
    dispatch_namespaces: T.Optional(T.Array(DispatchNamespace)),
    dev: T.Optional(DevelopmentSettings),
    site: T.Optional(WorkerSite),
    env: T.Optional(T.Record(T.String(), T.Omit(Config, ["env"]))),
  })
)

WorkerConfig.$schema = "http://json-schema.org/draft-07/schema#"

const file_name = process.argv[2] || "wrangler.schema.json"
await fs.writeFile(file_name, JSON.stringify(WorkerConfig, null, 2))
