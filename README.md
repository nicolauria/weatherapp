# Weather App

## Technologies Used:

### Rails

### jQuery

### Bootstrap

### localStorage

The application only has one controller: StaticPagesController.\
This controller supports one action: index\
The root route and all other routes hit StaticPagesController#index

The index.html file contains a sidebar with a list of recent searches and a main div used to display todays forecast and the 5 day forecast

The application logic is contained in static_pages.js and served with the index.html file.

All api responses are cached in localStorage for 30 minutes. The localStorage object is an array of objects. Each object has the address searched as a key and the api response as an additional nested object. See below:

```
[
  {
    "1234 Sample St": {
      api response here...
    }
  },
  {
    "5678 Another St": {
      api response here...
    }
  }
]
```

Api cals are made to the [openweathermap api](https://openweathermap.org/).
You will notice there are two input boxes one for the address and one for the city. I originally was going to use one input and then use a regex to extract the zip code but I was having trouble with this. I haven't used regex that much and I couldn't find a solution online so I took a different approach. I used the city provided to query the api. If an invalid city is provided the application displays a 'no results found' message. Using the city to perform the queries also makes it easier to support international address searches.
