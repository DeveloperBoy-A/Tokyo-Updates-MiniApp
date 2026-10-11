# Tokyo Updates Mini App

A responsive Telegram Mini App starter for the Tokyo Updates brand, built with FastAPI and a lightweight HTML/CSS/JavaScript frontend.

## Included

- Responsive dark/neon Tokyo Updates interface
- Live search and category filters for the sample catalog
- Telegram WebApp SDK integration and server-side Telegram `initData` signature validation
- Optional MongoDB connection and basic profile/referral scaffolding
- Telegram Stars VIP invoice creation endpoint and webhook handling for successful payments
- Dockerfile and Render Blueprint

## Run locally

```bash
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\\Scripts\\activate
pip install -r requirements.txt
uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

Open `http://localhost:8000`. Browser preview works without Telegram auth by default. Set `REQUIRE_TELEGRAM_AUTH=true` for production so protected profile/catalog features require a valid Telegram session where implemented.

## Environment variables

Configure these in Render (do not commit real secrets):

- `BOT_TOKEN`: Telegram bot token; required for validating `initData` and creating Stars invoices
- `BOT_USERNAME`: bot username without `@`
- `WEBAPP_URL`: public HTTPS Mini App URL
- `MONGODB_URI`: MongoDB Atlas URI; required for recording VIP payment entitlements
- `MONGODB_DATABASE`: database name, defaults to `tokyo_updates`
- `REQUIRE_TELEGRAM_AUTH`: set `true` for production
- `TELEGRAM_WEBHOOK_SECRET`: optional secret used to authenticate Telegram webhook requests

## Deploy to Render

1. Create a Docker web service or Blueprint from this repository.
2. Add the environment variables above in the Render dashboard.
3. Wait for `/api/health` to return `{"ok":true,...}`.
4. Configure the Telegram bot's Mini App/menu button in BotFather with the deployed HTTPS URL.
5. Configure the bot webhook to point to `https://YOUR-SERVICE.onrender.com/api/telegram/webhook`. If `TELEGRAM_WEBHOOK_SECRET` is set, provide the same value as Telegram's `secret_token` when calling `setWebhook`.

## VIP and payment notes

- The VIP button requests a one-time 30-day Telegram Stars invoice priced at **100 Stars**.
- Successful payment is recorded only after Telegram sends a `successful_payment` webhook update, and the user's VIP expiry is stored in MongoDB.
- Configure the webhook before testing payment. Test with a Telegram account in your bot and confirm the webhook is reachable.
- Do not treat a client-side invoice callback alone as proof of payment. The backend webhook is the source of truth.
- This is an initial implementation; test the full invoice, pre-checkout, webhook, duplicate-update, and expiry flows before accepting real payments.

## Catalog and referrals

The catalog in `app.py` contains sample entries. Replace `CATALOG` with your real catalog/database integration. The referral endpoint is basic scaffolding and needs referral-code creation/registration integrated with your bot before launch.

## Health endpoint

`GET /api/health` returns service health and whether MongoDB is configured.
