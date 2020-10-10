import users from '../database/users';

// context는 모든 graphQL api요청이 불릴때마다 항상 실행되는 함수
// 컨텍스트에 사용자 인증 정보를 저장해서 특정 api 실행 권한이 있는지 확인하는 용도로 사용
const context = ({ req }) => {
    const token = req.headers.authorization || '';
    if (token.length != 64 ) return { user: null};
    // token의 길이는 64까지 가능
    const user = users.find(user => user.token === token);
    return { user };
};

export default context;

