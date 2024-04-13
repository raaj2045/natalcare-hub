<!-- Documentation for the Natalcare Hub Project which is a PoC App for empowering expecting mothers with comprehensive prenatal care. -->
Natalcare Hub Project is a PoC App for empowering expecting mothers with comprehensive prenatal care.

## Getting Started

### Prerequisites

Ensure you have the following installed on your system:

- Node.js (version 20 or above)
- npm (version 10 or above)

### Steps

1. Clone the repository to your local machine using `git clone https://github.gatech.edu/rmishra76/natalcare-hub.git`.
2. Navigate to the project directory using `cd natalcare-hub`.
3. Install the project dependencies using `npm install`.
4. Set up environment variables. Create a `.env.local` file in the root directory of your project. Add the following lines to the file:

```bash
NEXTAUTH_SECRET=<your-secret>
NEXTAUTH_URL=<your-url>
API_KEY=<your-api-key>
```

Replace the above values with your actual values.

NEXTAUTH_SECRET: Generate a secure token. You can use a tool like https://www.lastpass.com/features/password-generator to generate a secure token.
NEXTAUTH_URL: The base URL of your application. This should be the URL where your application will be deployed.
API_KEY: This is the API key you get from setting up a new Firebase project.

### Firebase Configuration

In addition to the environment variables, you will also need to configure Firebase. Enable firestore and the email-based authentication for your firebase project. Get the firebase configurations and update the app/firebase.js file with your configurations. Here's an example:

```javascript
const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: "<your-auth-domain>",
  projectId: "<your-project-id>",
  storageBucket: "<your-storage-bucket>",
  messagingSenderId: "<your-messaging-sender-id>",
  appId: "<your-app-id>"
};
```


Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


## Project Structure

This is a Next.js project built using SHADCN UI and TailwindCSS with a few additional directories for organization. Here's a brief overview:

- `app/layout.js`: This is the entry file of the project.
- `app/page.jsx`: This file corresponds to the page available at the root route `yourwebsite.com/`.
- `app/<Page_Name>/page.jsx`: This directory contains all the page components. Each folder corresponds to a route based on its name.
- `app/components/`: This directory contains reusable components that can be used across different pages.
- `app/api/`: This directory contains files for handling API calls.
- `/components/`: This directory contains resuable components installed through shadcn UI.

Remember, each folder inside the `app` directory becomes a route automatically. For example, `app/Home/page.jsx` would be accessible at `yourwebsite.com/Home`.

## Editing the Project

You can start editing the page by modifying the files in the `app/<PAGE>/page.jsx` directory. The page auto-updates as you edit the file. For example, to edit the homepage, you would update `pages/index.js`. For modifying the APIs you can start editing `app/api/<api-path>/route.js`.

## Using the Project


## Learn More

To learn more about Next.js and the tools used in this project, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [Learn Firebase](https://firebase.google.com/docs/) - learn about Firebase.
- [Learn shadcn/ui](https://ui.shadcn.com/docs) - learn about shadcn/ui.
- [Learn Tailwindcss](https://v2.tailwindcss.com/docs) - learn about Tailwindcss.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
