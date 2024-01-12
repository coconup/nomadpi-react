const makeCrudEndpoints = (spec, builder) => {
	let endpoints = {};

  // GET endpoint
  endpoints[`get${spec.resourceNamePlural}`] = builder.query({
    query: () => `/${spec.apiPath}`,
    transformResponse: (result, meta) => {
      if(result) {
        return result.map(row => new spec.model(row));
      }
    },
    providesTags: (result) => {
      return result ? result.map(({tags}) => tags) : []
    }
  });

  // POST endpoint
  endpoints[`create${spec.resourceNameSingular}`] = builder.mutation({
    query: (data) => ({
      url: `${spec.apiPath}`,
      method: 'post',
      body: data
    }),
    invalidatesTags: (result, error, payload, request) => {
      if(result) {
        const item = new spec.model(result);
        return item.tags;
      }
    }
  });

  // PUT endpoint
  endpoints[`update${spec.resourceNameSingular}`] = builder.mutation({
    query: (data) => ({
      url: `${spec.apiPath}/${data.id}`,
      method: 'put',
      body: data
    }),
    invalidatesTags: (result, error, payload, request) => {
      if(result) {
        const item = new spec.model(result);
        return item.tags;
      }
    }
  });

  // DELETE endpoint
  endpoints[`delete${spec.resourceNameSingular}`] = builder.mutation({
    query: (data) => ({
      url: `${spec.apiPath}/${data.id}`,
      method: 'delete'
    }),
    invalidatesTags: (result, error, payload, request) => {
      if(result) {
        const item = new spec.model(result);
        return item.tags;
      }
    }
  });
  

    console.log(endpoints)

  return endpoints;
}

module.exports = { makeCrudEndpoints };