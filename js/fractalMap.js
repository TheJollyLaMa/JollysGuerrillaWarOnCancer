const palette = ["#ff7a00", "#13b0a5", "#845ef7", "#ffcb05", "#1c7ed6"];

function createSvgElement(name, attributes) {
  const element = document.createElementNS("http://www.w3.org/2000/svg", name);

  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });

  return element;
}

export function renderFractalMap(root, entries) {
  root.replaceChildren();

  const centerX = 450;
  const centerY = 260;
  const radius = 170;

  const hub = createSvgElement("circle", {
    cx: centerX,
    cy: centerY,
    r: 50,
    fill: "#13243d"
  });
  const hubLabel = createSvgElement("text", {
    x: centerX,
    y: centerY + 6,
    "text-anchor": "middle",
    fill: "#ffffff",
    "font-size": "16",
    "font-weight": "700"
  });
  hubLabel.textContent = "DecentCanopy";
  root.append(hub);
  root.append(hubLabel);

  entries.forEach((entry, index) => {
    const angle = (Math.PI * 2 * index) / entries.length - Math.PI / 2;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    const color = palette[index % palette.length];

    root.append(
      createSvgElement("line", {
        x1: centerX,
        y1: centerY,
        x2: x,
        y2: y,
        stroke: color,
        "stroke-width": "4"
      })
    );
    root.append(
      createSvgElement("circle", {
        cx: x,
        cy: y,
        r: 38,
        fill: color
      })
    );
    const entryLabel = createSvgElement("text", {
      x,
      y: y + 4,
      "text-anchor": "middle",
      fill: "#ffffff",
      "font-size": "12",
      "font-weight": "700"
    });
    entryLabel.textContent = entry.title.slice(0, 16);
    root.append(entryLabel);

    entry.associated_tags.slice(0, 3).forEach((tag, tagIndex) => {
      const tagAngle = angle + (tagIndex - 1) * 0.45;
      const tagRadius = 92;
      const tagX = x + tagRadius * Math.cos(tagAngle);
      const tagY = y + tagRadius * Math.sin(tagAngle);

      root.append(
        createSvgElement("line", {
          x1: x,
          y1: y,
          x2: tagX,
          y2: tagY,
          stroke: "#1c3759",
          "stroke-dasharray": "6 4"
        })
      );
      root.append(
        createSvgElement("circle", {
          cx: tagX,
          cy: tagY,
          r: 20,
          fill: "#fff"
        })
      );
      const tagLabel = createSvgElement("text", {
        x: tagX,
        y: tagY + 4,
        "text-anchor": "middle",
        fill: "#13243d",
        "font-size": "9",
        "font-weight": "700"
      });
      tagLabel.textContent = tag.slice(0, 12);
      root.append(tagLabel);
    });
  });
}
