import { gql } from 'apollo-server';

// 스키마에서는 자료 구조와 자료형을 정의 해야 한다. 
// 그래야 그래프 큐엘에서 데이터 베이스의 구조를 인식할 수 있다.
// 뒤어 붙는 "!"는 Not Nullable.
// Query는 데이터베이스를 읽는 요청
// Mutation은 데이터베이스를 추가하는 요청
// books는 전체 데이터베이스 조회.
// book은 id에 해당하는 데이터 하나만 조회.
// user가 로그인을 했을 경우 user에 대한 세부 정보를 반환
const typeDefs = gql`
    type User {
        id: Int!
        name: String
        email: String!
        password: String
        role: [String!]!
        token: String
    }

    type Book {
        id: Int!
        title: String!
        author: String!
        publisher: String!
    }

    type Query {
        books: [Book!]!
        book(id: Int!): Book
        users: [User]!
        me: User!
    }

    type Mutation {
        addBook(title: String!, author: String!, publisher: String!): Book!
        signUp(name: String! email: String!, password: String!): Boolean!
        signIn(email: String! password: String!): User
        signOut: Boolean!
    }
`
export default typeDefs;