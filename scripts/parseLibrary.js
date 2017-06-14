const tsv = require("node-tsv-json")
const Lokka = require("lokka").Lokka
const Transport = require("lokka-transport-http").Transport
const _ = require("lodash")

process.env.TZ = "UTC"

const client = new Lokka({
  transport: new Transport("https://api.graph.cool/simple/v1/cj3wddehuuaou0165nhtwz1vd"),
})

function importRecords(records) {
  return records.map(record => {
    const {
      "call number": call,
      title,
      composer,
      "editor arranger": arranger,
      instrument: instruments,
      ensemble,
      publisher,
      key,
      maj_min: keyType,
      style,
    } = record
    return {
      call: call.split("/").map(i => i.trim()).join("/"),
      title,
      composer,
      arranger,
      instruments: instruments
        .split(/,(?![^\()]*\))/)
        .map(i => i.trim().split(/ or (?![^\()]*\))/).map(j => _.upperFirst(j.trim())).sort())
        .sort(),
      ensemble,
      key,
      keyType,
      publisher,
      style,
    }
  })
}

// const createBook = async(record) => {
//   const result = await client.mutate(`{
//     book: createBook

//   }`)
// }

tsv(
  {
    input: "musicLibraryCatalog.tsv",
    output: "musicLibraryCatalog.json",
  },
  (err, res) => {
    if (err) {
      console.error(err)
    } else {
      const result = importRecords(res)
      result.map(r => (r.instruments.length > 1 ? console.log(r.instruments) : null))
    }
  }
)
