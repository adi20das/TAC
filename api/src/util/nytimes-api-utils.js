export function buildFilterQuery(preferences) {
  const baseQuery = 'type_of_material.contains:("News","Archives","Article")';
  if (!preferences || preferences.length === 0) {
    return encodeURIComponent(baseQuery);
  }

  const preferencesString = preferences.map((p) => `"${p.preference}"`).join(',');
  return encodeURIComponent(`${baseQuery} AND news_desk.contains:(${preferencesString})`);
}
