const updateTabMetadata = (name, logoUrl) => {
  // Update Document Title
  if (name) document.title = `${name} | Secure Workspace`;

  // Update Favicon
  const link = document.querySelector("link[rel~='icon']");
  if (link && logoUrl) {
    link.href = logoUrl;
  }
};