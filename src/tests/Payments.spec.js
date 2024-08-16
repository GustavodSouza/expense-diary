import { mount } from '@vue/test-utils';
import Payments from '@/pages/Payments.vue';

test('Teste de método', () => {
  const wrapper = mount(Payments);

  const text = wrapper.vm.teste;

  expect(text).toBe('Teste');
});
