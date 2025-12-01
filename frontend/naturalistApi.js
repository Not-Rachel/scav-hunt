function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
async function getItems(query = '') {
  try {
    const id = getRandomInt(5);
    const URL = `https://api.inaturalist.org/v1/observations/species_counts?lat=33.654474&lng=-117.609137&radius=1&per_page=12&${query}`;

    console.log(URL);
    const response = await fetch(URL);
    if (!response.ok) {
      alert(response.status);
      return;
    }
    const natItems = await response.json();

    return natItems.results;
    // console.log(natural.data.length);
  } catch (err) {
    alert(err);
  }
}

export default getItems;
