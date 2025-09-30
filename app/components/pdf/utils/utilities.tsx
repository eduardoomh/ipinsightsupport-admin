import { Text, View } from "@react-pdf/renderer";
import { styles } from "./styles";

interface TemplateVariables {
  company_name?: string;
  [key: string]: string | undefined;
}

export function extractFormattedContentFromHTMLv2(
  html: string,
  vars?: TemplateVariables
): JSX.Element[] {
  const elements: JSX.Element[] = [];
  let keyIndex = 0;

  // Elimina <br> tags completamente
  html = html.replace(/<br\s*\/?>/gi, "");

  // Reemplazo de variables tipo ${company_name}
  if (vars) {
    for (const [key, value] of Object.entries(vars)) {
      if (value) {
        const varPattern = new RegExp(`\\$\\{${key}\\}`, "g");
        html = html.replace(varPattern, value);
      }
    }
  }

  // 🔄 Reemplaza &nbsp; por espacio real
  html = html.replace(/&nbsp;/gi, " ");

  // Expresión regular para capturar <p>, <ul>, <ol>
  const regex = /<(p|ul|ol)[^>]*>(.*?)<\/\1>/gis;
  let match;

  while ((match = regex.exec(html)) !== null) {
    const [_, tag, inner] = match;

    if (tag === "p") {
      elements.push(
        <Text key={keyIndex++} style={styles.general_text}>
          {parseInlineHTML(inner)}
        </Text>
      );
    }

    if (tag === "ul" || tag === "ol") {
      const listItems = [...inner.matchAll(/<li[^>]*>(.*?)<\/li>/gis)];
      const listElement = (
        <View key={keyIndex++} style={{ marginBottom: 8 }}>
          {listItems.map((liMatch, i) => (
            <View
              key={i}
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                marginBottom: 2,
              }}
            >
              <Text style={styles.list_bullet}>•</Text>
              <Text style={styles.list_item_text}>
                {parseInlineHTML(liMatch[1])}
              </Text>
            </View>
          ))}
        </View>
      );
      elements.push(listElement);
    }
  }

  return elements;
}

function parseInlineHTML(html: string): (string | JSX.Element)[] {
  const result: (string | JSX.Element)[] = [];
  const regex = /(<(strong|em)>(.*?)<\/\2>)/gis;

  let lastIndex = 0;
  let match;

  while ((match = regex.exec(html)) !== null) {
    if (match.index > lastIndex) {
      result.push(html.slice(lastIndex, match.index));
    }

    if (match[2] === "strong") {
      result.push(
        <Text key={match.index} style={styles.bold}>
          {match[3]}
        </Text>
      );
    } else if (match[2] === "em") {
      result.push(
        <Text key={match.index} style={styles.italic}>
          {match[3]}
        </Text>
      );
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < html.length) {
    result.push(html.slice(lastIndex));
  }

  return result;
}