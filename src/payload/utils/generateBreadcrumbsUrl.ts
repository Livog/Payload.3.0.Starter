export default function generateBreadcrumbsUrl(docs: any, lastDoc: any) {
  let prefix = ''
  // You might want different prefixes for different collections.
  switch (lastDoc._collection) {
  }
  return docs.reduce((url: any, doc: any) => `${url}/${doc.slug ?? ''}`, prefix)
}
