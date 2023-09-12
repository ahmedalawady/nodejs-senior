import * as request from 'supertest';

export const createUserReturnToken = async (app: any, data: any) => {
  // SignUp Mutation
  const signUpMutation = `
    mutation {
      signUp(signUpUserInput: {
        email: "${data.email}",
        password: "${data.password}",
        role: USER
      })
    }
  `;
  
  console.log(data);
  
  await request(app.getHttpServer()).post('/graphql').send({
    query: signUpMutation,
  });

  // Login Mutation
  const loginMutation = `
    mutation {
      login(loginUserInput: {
        email: "${data.email}",
        password: "${data.password}"
      }) {
        access_token
      }
    }
  `;

  const login = await request(app.getHttpServer()).post('/graphql').send({
    query: loginMutation,
  });

  return login.body.data.login.access_token;
};
