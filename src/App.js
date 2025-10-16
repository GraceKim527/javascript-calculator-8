import { Console } from "@woowacourse/mission-utils";

class App {
  checkEmptyString(input) {
    if (input === "") {
      throw new Error("[ERROR] 빈 문자열은 입력할 수 없습니다.");
    }
  }

  add(input) {
    this.checkEmptyString(input);
    if (input.length === 1) {
      return Number(input);
    }
    const tokens = input.split(/,|:/);
    return tokens.reduce((acc, curr) => acc + Number(curr), 0);
  }

  async run() {
    const input = await Console.readLineAsync(
      "덧셈할 문자열을 입력해주세요. \n"
    );
    try {
      this.checkEmptyString(input);
    } catch (error) {
      Console.print(`[ERROR] ${error.message}`);
      return;
    }
    Console.print(`결과 : ${this.add(input)}`);
  }
}

export default App;
