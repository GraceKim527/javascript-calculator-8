import { Console } from "@woowacourse/mission-utils";

class App {
  validateTokens(tokens) {
    tokens.forEach((token) => {
      const trimmedToken = token.trim();

      if (!/^\d+$/.test(trimmedToken)) {
        throw new Error("숫자가 아닌 값이 입력되었습니다.");
      }

      const number = Number(trimmedToken);
      if (number < 0) {
        throw new Error("음수는 허용되지 않습니다.");
      }
    });
  }

  // 입력 유효성 검사
  validateCharacters(input) {
    // 커스텀 구분자 형식인 경우
    if (this.isCustomDelimiterFormat(input)) {
      const customPattern = /^\/\/(.)\\n(.*)$/;
      const match = input.match(customPattern);
      if (!match) {
        throw new Error("커스텀 구분자 형식이 올바르지 않습니다.");
      }
      const [, delimiter, numbers] = match;

      // 커스텀 구분자가 숫자나 기본 구분자(,:)인 경우 에러
      if (/[\d,:]/.test(delimiter)) {
        throw new Error(
          "커스텀 구분자로 숫자나 기본 구분자는 사용할 수 없습니다."
        );
      }

      // 숫자와 구분자 외의 문자가 있는지 검사
      const validNumbersPattern = new RegExp(`^[0-9${delimiter}]*$`);
      if (!validNumbersPattern.test(numbers)) {
        throw new Error("허용되지 않은 문자가 포함되어 있습니다.");
      }
      return;
    }

    // 일반 입력의 경우
    const allowedPattern = /^[0-9,:]+(,[0-9,:]+)*$/;
    if (!allowedPattern.test(input)) {
      throw new Error("올바르지 않은 문자 또는 형식이 포함되어 있습니다.");
    }
  }

  // 커스텀 구분자 형식 검사
  isCustomDelimiterFormat(input) {
    return input.startsWith("//") && input.includes("\\n");
  }

  // 커스텀 구분자 처리
  getTokens(input) {
    // 커스텀 구분자 처리
    if (this.isCustomDelimiterFormat(input)) {
      const customPattern = /^\/\/(.)\\n(.*)$/;
      const match = input.match(customPattern);
      const delimiter = match[1];
      const numbers = match[2];

      if (!numbers) {
        throw new Error("구분자 뒤에 숫자가 없습니다.");
      }

      return numbers.split(delimiter);
    }

    // 기본 구분자(쉼표, 콜론) 처리
    if (input.includes(",") || input.includes(":")) {
      const tokens = input.split(/[,:]/).filter((token) => token.length > 0);
      if (tokens.length === 0) {
        throw new Error("구분자만 있고 숫자가 없습니다.");
      }
      return tokens;
    }

    // 단일 숫자 처리
    if (!/^\d+$/.test(input)) {
      throw new Error("올바르지 않은 입력 형식입니다.");
    }

    return [input];
  }

  add(input) {
    // 빈 문자열 처리
    if (input.trim() === "") {
      return 0;
    }

    // 입력값 형식 검증
    this.validateCharacters(input);

    const tokens = this.getTokens(input);
    this.validateTokens(tokens);

    // 숫자 변환 및 합산
    const sum = tokens.reduce((acc, curr) => {
      const number = Number(curr.trim());
      return acc + number;
    }, 0);

    return sum;
  }

  async run() {
    const input = await Console.readLineAsync(
      "덧셈할 문자열을 입력해주세요. \n"
    );
    try {
      const result = this.add(input);
      Console.print(`결과 : ${result}`);
    } catch (error) {
      Console.print(`[ERROR] ${error.message}`);
      throw new Error(`[ERROR] ${error.message}`);
    }
  }
}

export default App;
