import { icebreaker } from "@icebreakers/eslint-config";

export default icebreaker({
  rules: {
    "@style/semi": ["error", "always"],
    "@style/semi-spacing": ["error", { before: false, after: true }],
  },
});
