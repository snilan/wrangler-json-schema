# JSON Schema for Cloudflare Workers Configuration

## VSCode

### If you're using wrangler.toml
I recommend the [Even Better TOML](https://marketplace.visualstudio.com/items?itemName=tamasfe.even-better-toml) extension. Follow the instructions [here](https://taplo.tamasfe.dev/).

### If you're using wrangler.json with the --experimental-json-config flag
Add the following to your User Settings file (settings.json)
```json
"json.schemaDownload.enable": true,
"json.schemas": [
  {
    "fileMatch": ["wrangler.json"],
    "url": "https://raw.githubusercontent.com/snilan/wrangler-json-schema/main/wrangler.schema.json"
  }
],
```
