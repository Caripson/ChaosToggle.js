import type { ChaosEffect } from '../core/types';

const fakeErrorState: ChaosEffect = {
  id: 'fakeErrorState',
  name: 'Fake error',
  description: 'Applies a dramatic color shift reminiscent of a broken display.',
  category: 'prank',
  apply(ctx) {
    ctx.root.classList.add('ct-error');
    return () => {
      ctx.root.classList.remove('ct-error');
    };
  },
};

export default fakeErrorState;
