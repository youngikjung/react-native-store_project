import {AppRoute} from '~/routes/AppRoutes';

const getConfig = (iDuration = 150) => {
  return {
    animation: 'timing',
    config: {
      duration: iDuration,
    },
  };
};

const forFade = ({current, closing}) => ({
  cardStyle: {
    opacity: current.progress,
  },
});

export const EffectFadeIn = props => {
  let iCustomDuration = 250;
  if (props.route.name == AppRoute.MAIN) {
    iCustomDuration = 250;
  }
  return {
    cardStyleInterpolator: forFade,
    transitionSpec: {
      open: getConfig(iCustomDuration),
      close: getConfig(iCustomDuration),
    },
  };
};
