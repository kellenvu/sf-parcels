# sf-parcels

A search page that allows users to browse through parcels in San Francisco and get information about parcel address, parcel number, building area, land use, year built, and zoning.

# Description

This was my first time working with an API. When I began this project, I had two possible approaches in mind: (1) querying the entire database, and then allowing the user to filter through all the data, or (2) allowing the user to specify filters beforehand, and then querying with those filters. I ultimately decided to go with the first approach. The benefit of this approach is that it allows for very quick filtering, once the data has been retrieved. The downside is that it takes a while to load all the data initially. Depending on the use case, this could be a worthwhile tradeoff--for example, if the user wants to browse through many parcels and try many filters, it's better to put the wait time at the start to allow for a smooth user experience.

# Reflections

Currently, the webpage takes a long time to load because it queries and cleans the data each time you open the page. If I were to do this project again, I would query and clean the the data in advance, so that the page loads faster. To keep the data updated, I would re-query in periodic intervals (e.g. once per day).

# Demo

You can test out the webpage [here](https://mint-great-coal.glitch.me/).

<img src='https://i.imgur.com/YsqiDgG.png' width='800' alt='Demo' />

# Data Sources

- https://data.sfgov.org/Housing-and-Buildings/Land-Use/us3s-fp9q/
- https://data.sfgov.org/Geographic-Locations-and-Boundaries/Parcels-Active-and-Retired/acdm-wktn/data
