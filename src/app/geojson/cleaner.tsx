export interface GeoJSON {
  features: Feature[];
}

interface Feature {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  properties?: Record<string, any>;
}

export function cleanGeojsonProperties(geoJson: GeoJSON): GeoJSON {
  const parser = new DOMParser();

  geoJson.features = geoJson.features.map((feature) => {
    const { properties = {} } = feature;

    // Extract HTML from the Description field
    const description = properties["Description"];
    if (description) {
      // Parse the HTML content
      const doc = parser.parseFromString(description, "text/html");
      const rows = doc.querySelectorAll("tr");

      // Create a new properties object
      const newProperties: Record<string, string> = {};
      rows.forEach((row) => {
        const [keyCell, valueCell] = row.querySelectorAll("th, td");
        if (keyCell && valueCell) {
          const key = keyCell.textContent?.trim() || "";
          const value = valueCell.textContent?.trim() || "";
          if (key) newProperties[key] = value;
        }
      });

      // Assign the new properties and remove the Description field
      feature.properties = { ...feature.properties, description: undefined,  ...newProperties };
      delete feature.properties["Description"];
    }

    return { ...feature, properties: feature.properties };
  });

  return geoJson;
}
