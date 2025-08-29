export class Text {
  public static truncate(text?: string, mobileLength?: number, maxLength: number = 30) {
    if (!text) return "";

    if (text.length > (window.innerWidth < 1024 && mobileLength ? mobileLength : maxLength)) {
      return text.substring(0, maxLength - 5) + " ...";
    }

    return text;
  }
}