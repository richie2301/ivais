using Raven.Client.Documents;

namespace ignis.Infrastructure.Persistence
{
    public static class DocumentStoreHolder
    {
        private static readonly Lazy<IDocumentStore> LazyStore =
            new Lazy<IDocumentStore>(() =>
            {
                DocumentStore store = new DocumentStore
                {
                    Urls = new[] { "http://localhost:2175" },
                    Database = "IGNIS"
                };

                return store.Initialize();
            });

        public static IDocumentStore Store => LazyStore.Value;
    }
}