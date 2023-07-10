import { Static, Type } from "@sinclair/typebox"
import { promises as fs } from "node:fs"

const Route = Type.Union([
  Type.String(),
  Type.Object({
    pattern: Type.String(),
    zone_id: Type.String(),
    custom_domain: Type.Optional(Type.Boolean()),
  }),
  Type.Object({
    pattern: Type.String(),
    zone_name: Type.String(),
    custom_domain: Type.Optional(Type.Boolean()),
  }),
  Type.Object({
    pattern: Type.String(),
    custom_domain: Type.Optional(Type.Boolean()),
  }),
])

const Rule = Type.Object({
  type: Type.Union([
    Type.Literal("ESModule"),
    Type.Literal("CommonJS"),
    Type.Literal("CompiledWasm"),
    Type.Literal("Text"),
    Type.Literal("Data"),
  ]),
  globs: Type.Array(Type.String()),
  fallthrough: Type.Optional(Type.Boolean()),
})

const CustomBuild = Type.Object({
  command: Type.String(),
  cwd: Type.Optional(Type.String()),
  watch_dir: Type.Optional(
    Type.Union([Type.String(), Type.Array(Type.String())])
  ),
})

const DevelopmentSettings = Type.Object({
  ip: Type.Optional(Type.String()),
  port: Type.Optional(Type.Number()),
  local_protocol: Type.Optional(
    Type.Union([Type.Literal("http"), Type.Literal("https")])
  ),
  upstream_protocol: Type.Optional(
    Type.Union([Type.Literal("http"), Type.Literal("https")])
  ),
  host: Type.Optional(Type.String()),
})

const D1Binding = Type.Object({
  binding: Type.String(),
  database_name: Type.String(),
  database_id: Type.String(),
  preview_database_id: Type.Optional(Type.String()),
})

const DurableObjectBinding = Type.Object({
  name: Type.String(),
  class_name: Type.String(),
  script_name: Type.Optional(Type.String()),
  environment: Type.Optional(Type.String()),
})

const DurableObjectMigration = Type.Object({
  tag: Type.String(),
  new_classes: Type.Optional(Type.Array(Type.String())),
  renamed_classes: Type.Optional(
    Type.Array(
      Type.Object({
        from: Type.String(),
        to: Type.String(),
      })
    )
  ),
  deleted_classes: Type.Optional(Type.Array(Type.String())),
})

const KVBinding = Type.Object({
  binding: Type.String(),
  id: Type.String(),
  preview_id: Type.Optional(Type.String()),
})

const R2BucketBinding = Type.Object({
  binding: Type.String(),
  bucket_name: Type.String(),
  preview_bucket_name: Type.Optional(Type.String()),
})

const ServiceBinding = Type.Object({
  binding: Type.String(),
  service: Type.String(),
  environment: Type.Optional(Type.String()),
})

const TailConsumerBinding = Type.Omit(ServiceBinding, ["binding"])

const QueueProducerBinding = Type.Object({
  binding: Type.String(),
  queue: Type.String(),
})

const QueueConsumerBinding = Type.Object({
  queue: Type.String(),
  max_batch_size: Type.Optional(Type.Number()),
  max_batch_timeout: Type.Optional(Type.Number()),
  max_retries: Type.Optional(Type.Number()),
  dead_letter_queue: Type.Optional(Type.String()),
  max_concurrency: Type.Optional(Type.Number()),
})

const AnalyticsEngineDatasetBinding = Type.Object({
  binding: Type.String(),
  dataset: Type.Optional(Type.String()),
})

const MTLSCertificateBinding = Type.Object({
  binding: Type.String(),
  certificate_id: Type.String(),
})

const SendEmailBinding = Type.Union([
  Type.Object({
    type: Type.Literal("send_email"),
    name: Type.String(),
    desination_address: Type.String(),
  }),
  Type.Object({
    type: Type.Literal("send_email"),
    name: Type.String(),
    allowed_destination_addresses: Type.Array(Type.String()),
  }),
])

const ConstellationBinding = Type.Object({
  binding: Type.String(),
  project_id: Type.String(),
})

const BrowserBinding = Type.Object({
  binding: Type.String(),
  type: Type.Literal("browser"),
})

const DispatchNamespace = Type.Object({
  binding: Type.String(),
  namespace: Type.String(),
  outbound: Type.Optional(
    Type.Object({
      service: Type.String(),
      parameters: Type.Array(Type.String()),
    })
  ),
})

const WorkerSite = Type.Object({
  bucket: Type.String(),
  include: Type.Optional(Type.Array(Type.String())),
  exclude: Type.Optional(Type.Array(Type.String())),
})

const WorkerConfig = Type.Recursive((Config) =>
  Type.Object({
    name: Type.String(),
    main: Type.String(),
    compatibility_date: Type.Union([Type.String(), Type.Date()]),
    account_id: Type.Optional(Type.String()),
    compatibility_flags: Type.Optional(Type.Array(Type.String())),
    workers_dev: Type.Optional(Type.Boolean()),
    route: Type.Optional(Route),
    routes: Type.Optional(Type.Array(Route)),
    tsconfig: Type.Optional(Type.String()),
    triggers: Type.Optional(
      Type.Object({
        crons: Type.Array(Type.String()),
      })
    ),
    usage_model: Type.Optional(
      Type.Union([Type.Literal("Bundled"), Type.Literal("Unbound")])
    ),
    rules: Type.Optional(Type.Array(Rule)),
    build: Type.Optional(CustomBuild),
    no_bundle: Type.Optional(Type.Boolean()),
    minify: Type.Optional(Type.Boolean()),
    node_compat: Type.Optional(Type.Boolean()),
    send_metrics: Type.Optional(Type.Boolean()),
    keep_vars: Type.Optional(Type.Boolean()),
    logpush: Type.Optional(Type.Boolean()),
    define: Type.Optional(Type.Record(Type.String(), Type.String())),
    vars: Type.Optional(Type.Record(Type.String(), Type.String())),
    d1_databases: Type.Optional(Type.Array(D1Binding)),
    durable_objects: Type.Optional(Type.Array(DurableObjectBinding)),
    migrations: Type.Optional(Type.Array(DurableObjectMigration)),
    kv_namespaces: Type.Optional(Type.Array(KVBinding)),
    r2_buckets: Type.Optional(Type.Array(R2BucketBinding)),
    services: Type.Optional(Type.Array(ServiceBinding)),
    queues: Type.Optional(
      Type.Object({
        producers: Type.Optional(Type.Array(QueueProducerBinding)),
        consumers: Type.Optional(Type.Array(QueueConsumerBinding)),
      })
    ),
    analytics_engine_datasets: Type.Optional(
      Type.Array(AnalyticsEngineDatasetBinding)
    ),
    mlts_certificates: Type.Optional(
      Type.Array(MTLSCertificateBinding)
    ),
    send_email: Type.Optional(Type.Array(SendEmailBinding)),
    tail_consumers: Type.Optional(Type.Array(TailConsumerBinding)),
    constellation: Type.Optional(Type.Array(ConstellationBinding)),
    browser: Type.Optional(BrowserBinding),
    dispatch_namespaces: Type.Optional(Type.Array(DispatchNamespace)),
    dev: Type.Optional(DevelopmentSettings),
    site: Type.Optional(WorkerSite),
    env: Type.Optional(
      Type.Record(Type.String(), Type.Omit(Config, ["env"]))
    ),
  })
)

WorkerConfig.$schema = "http://json-schema.org/draft-07/schema#"

const file_name = process.argv[2] || "wrangler.schema.json"
await fs.writeFile(file_name, JSON.stringify(WorkerConfig, null, 2))
