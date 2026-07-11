module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Reanimated v4 utilise react-native-worklets pour la compilation des worklets.
      // Ce plugin DOIT être le dernier de la liste.
      'react-native-worklets/plugin',
    ],
  };
};
