variable = 5;

function somename () {

}

find(arr, (a, b) => {
  return true;
})

# sightbase;
# sight-api;
# sight-view;
# sight-realtime;

io.on("collection", (socket) => {

  const events = await e.find();

  events.map(i => {
    socket.on(i.name, (data) => {
      const s = new SightScript();
      s.compile();
      /** pass functions, data to state etc... */
      s.execute();
    })
  })

})


