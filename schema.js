const { getTop, spotifyLogout } = require('./spotify-api')
let makeExecutableSchema = require('graphql-tools').makeExecutableSchema;

let typeDefs = `
type ImageObject {
    width: Int
    height: Int
    url: String
}

type Album {
    id: String!
    label: String
    release_date: String
    image: ImageObject
}

type Song {
    id: String!
    album: Album
    name: String
    disc_number: Int
    duration_ms: Int
    explicit: Boolean
    href: String
    is_local: Boolean
    is_playable: Boolean
    popularity: Int
    preview_url: String
    track_number: Int
    type: String
    uri: String
}

type Query {
    topTracks(amount: Int!): [Song]
}

type Mutation {
    logout: Boolean
}
`

let getTopTracks = async (obj, args, context, info) => {
    // db work but dummy data

    let response = await getTop(args.amount);
    let limit = response.limit

    //return endpointcall

    const array = []
    for(let i = 0; i < limit; ++i){
        array.push({
            id: response.items[i].id,
            name: response.items[i].name,
            album: {
                id: response.items[i].album.id,
                label: response.items[i].album.name,
                release_date: response.items[i].album.release_date,
                image: {
                    height: response.items[i].album.images[0].height,
                    width: response.items[i].album.images[0].width,
                    url: response.items[i].album.images[0].url,
                }
            },
            disc_number: response.items[i].disc_number,
            duration_ms: response.items[i].duration_ms,
            explicit: response.items[i].explicit,
            href: response.items[i].href,
            is_local: response.items[i].is_local,
            is_playable: response.items[i].is_playable,
            popularity: response.items[i].popularity,
            preview_url: response.items[i].preview_url,
            track_number: response.items[i].track_number,
            type: response.items[i].type,
            uri: response.items[i].uri,
        })
    }
    
    return array
}

let logout = (obj, args, context, info) => {
    spotifyLogout()
}

let resolvers = {
    Query: {
        topTracks: getTopTracks,
    },
    Mutation: {
        logout: logout,
    },
}

module.exports.resolvers = {
    topTracks: getTopTracks,
    logout: logout,
}

module.exports.schema = makeExecutableSchema({
    typeDefs: typeDefs,
    resolvers: resolvers,
});