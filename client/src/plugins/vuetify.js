import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
// import colors from 'vuetify/es5/util/colors'

const defaultTheme = {
  primary: '#3B125F',
  secondary: '#8B5FBF',
  accent: '#BF653F',
  error: '#722530',
  warning: '#A37513',
  info: '#396893',
  success: '#4CAF50'
}

Vue.use(Vuetify)

export default new Vuetify({
  theme: {
    light: true,
    themes: {
      light: defaultTheme,
      dark: defaultTheme
    }
  },
  icons: {
    iconfont: 'md'
  }
})
