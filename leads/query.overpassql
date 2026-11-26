[out:json][timeout:90];
area["name"="Warszawa"]["admin_level"="6"]->.w;
(
  nwr["shop"~"^(hairdresser|beauty)$"](area.w);
  nwr["amenity"="cafe"](area.w);
);
out center tags;
