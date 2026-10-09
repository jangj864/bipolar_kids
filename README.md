
  # 5th Ave Bipolar Kids

  This is a code bundle for 5th Ave Bipolar Kids. The original project is available at https://www.figma.com/design/QH0OrUJProVYBsB01GWoYP/5th-Ave-Bipolar-Kids.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

## GitHub Pages

The site is configured for `https://jangj864.github.io/bipolar_kids/`.

In the repository's **Settings → Pages**, select **GitHub Actions** as the
build and deployment source. Push changes to `main` to run the
**Deploy GitHub Pages** workflow, or run it manually from the Actions tab.

The workflow installs locked dependencies, builds the site, and publishes `dist`.
To build locally with pnpm, run `pnpm install --frozen-lockfile` and `pnpm build`.
