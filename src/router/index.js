import { createWebHistory, createRouter } from "vue-router";
import DiceGame from "/src/views/DiceGame.vue";

const routes = [
  {
    path: "/",
    name: "DiceGame",
    component: DiceGame,
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;