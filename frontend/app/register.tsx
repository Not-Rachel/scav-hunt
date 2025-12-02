import { Text } from 'react-native';
import Form from './components/Form';
export default function Register() {
  return (
    <>
      <Text>Make sure you register</Text>
      <Form route={'/api/user/register/'} method={'register'}></Form>
    </>
  );
}
