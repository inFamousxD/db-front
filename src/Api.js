
///
//
// Methods of this class are used to simulate calls to server.
//
class Api {
  getItemUsingID(id) {
    let products;
    return new Promise(async (resolve, reject) => {
        await fetch(`http://localhost:3000/products-id?id=${id}`)
        .then(function(response) {
           return response.json()
        }).then(function(data) {
            products = data.products;
        });

        products.forEach(product => {
            product.imageUrls = [product.imageUrls];
        })

        let res = products.filter(x => x.id === parseInt(id, 10));
        resolve(res.length === 0 ? null : res[0]);
    });
  }

  sortByPrice(data, sortval) {
    if (sortval !== "lh" && sortval !== "hl") return data;

    let items = [...data];

    if (sortval === "lh") {
      items.sort((a, b) => a.price - b.price);
    } else {
      items.sort((a, b) => b.price - a.price);
    }

    return items;
  }

  searchItems({
    category = "popular",
    term = "",
    sortValue = "lh",
    itemsPerPage = 30,
    usePriceFilter = "false",
    minPrice = 0,
    maxPrice = 1000,
    page = 1
  }) {
    
    // Turn this into a boolean
    usePriceFilter = usePriceFilter === "true" && true;

    let products = [];

    let cat = new Set();
    return new Promise(async (resolve, reject) => {
        await fetch('http://localhost:3000/products-all')
        .then(function(response) {
           return response.json()
        }).then(function(data) {
            products = data.products;
        });

        products.forEach(product => {
            product.imageUrls = [product.imageUrls];
            cat.add(product.category)
        })

        console.log('CAT', cat)

        let data = products.filter(item => {
            if (
                usePriceFilter &&
                (item.price < minPrice || item.price > maxPrice)
            ) {
                return false;
            }

            if (category === "popular") {
                return item.popular;
            }

            if (category !== "All categories" && category !== item.category)
                return false;

            if (term && !item.name.toLowerCase().includes(term.toLowerCase()))
                return false;

            return true;
        });

        let totalLength = data.length;

        data = this.sortByPrice(data, sortValue);

        data = data.slice((page - 1) * itemsPerPage, page * itemsPerPage);

        resolve({ data, totalLength });
    });
  }
}

export default new Api();
