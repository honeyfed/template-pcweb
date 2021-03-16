// this is the global actions
import * as Api from '@/api';

export default {
  async getMenus({ commit }) {
    const defaulMenu = {
      title: '',
      children: [],
    };

    const menu = await Api.test();


    defaulMenu.children = menu.map(val => {
      return {
        ...val,
        showChildren: true
      };
    });
    console.log(defaulMenu)
    commit('changeMenus', [defaulMenu]);
  },
};
