import { AuthenticationError,  ForbiddenError } from 'apollo-server';
import * as bcrypt from 'bcrypt';
import * as sha256 from 'crypto-js/sha256';
// import rand from 'csprng';
import { randomBytes} from 'crypto'
import books from '../database/books';
import users from '../database/users';

// 리졸버는 요청이 왔을 때 서버가 어떻게 처리할지 정의함.
// 데이터 반환, 서치, 메모리 접근, 다른 API요청등을 통해 데이터를 가져올 수 있다.
// 리졸버는 4가지의 매개변수를 가진다.
// 내가 사용해야하는 매개변수의 위치를 정확히 하기 위해 사용하는 매개 변수 앞에 매개변수를 사용하지 않는다면
// 몇번째 위치한 매개변수 인지에 따라 숫자 만큼 _으로 채워줌
// 첫번째 매개변수: parent 부모타입 리졸버에서 반환된 결과를 가진 객체
// 두번째 매개변수: args 쿼리 요청시 전달된 인수를 가진 객체
// 세번째 매개변수: context 그래프큐엘의 모든 리졸버가 공유하는 객체로, 로그인인증, 데이터베이스 접근 권한등에 사용
// 네번째 매개변수: info 명령 실행 상태 정보를 가진 객체
const resolvers = {
    Query: {
        books: () => books,
        book: (_, { id }) => {
            return books.filter(book => book.id === id)[0];
        },
        // users: () => users,
        users: (_, __, { user }) => {
            // if (!user) throw new AuthenticationError('Not Authenticated');
            // if (!user.roles.includes(['admin']))
            //     throw new ForbiddenError('Not Authorized');
            return users;
        },
        me: (_, __, { user }) => {
            if (!user) throw new AuthenticationError('Not Authenticated');

            return user;
        }
    },
    Mutation: {
        addBook:(_, { title, author, publisher }) => {
            // 중복검사
            if (books.find((book) => book.title === title)) return null;

            const newBook = {
                id: books.length + 1,
                title,
                author,
                publisher,
            };
            books.push(newBook);
            return newBook;
        },
        signUp: (_, { name, email, password }) => {
            // 중복검사
            if (users.find((user) => user.email === email)) return false;

            bcrypt.hash(password, 10, async (err, passwordHash) => {
                const newUser = {
                    id: users.length + 1,
                    name,
                    email,
                    password: await passwordHash,
                    role: ['user'],
                    token: '',
                };
                users.push(newUser);
            })
            return true;
        },
        signIn: (_, { email, password }) => {
            let user = users.find((user) => user.email === email);
            if (!user) return null;
            if (user.token) return null;
            if (!bcrypt.compareSync(password, user.password)) return null;
            // csprng rand 함수 오류 발생
            // crypto의 randomBytes로 대체
            // user.token = sha256(rand(160,36) + email + password).toString();
            user.token = sha256(randomBytes(160) + email + password).toString();
            return user;
        },
        signOut: (_, __, { user }) => {
            if (user?.token) {
                user.token = '';
                return true;
            }
            throw new AuthenticationError('Not Authenticated');
        }
    }
};

export default resolvers;
