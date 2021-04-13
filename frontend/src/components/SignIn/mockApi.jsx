export default async function userSignIn({ name, email, password }) {
  return email === 'test@test.com' && password === 'password';
}
