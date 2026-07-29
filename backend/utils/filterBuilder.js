//
module.exports = {
  filterBuilder: (filters, config) => {
    const activeJoins = new Set();
    const conditions = [];

    for (const [filterKey, rule] of Object.entries(config)) {
      if (filters[filterKey] !== undefined && filters[filterKey] !== null) {
        conditions.push(rule.where);
        if (rule.joins) {
          rule.joins.forEach((join) => activeJoins.add(join));
        }
      }
    }

    return {
      joinsStr: Array.from(activeJoins).join(" "),
      whereStr: conditions.length ? `WHERE ${conditions.join(" AND ")}` : "",
    };
  },
};
