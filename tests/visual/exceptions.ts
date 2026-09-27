export const visualExceptions = [
  {
    scene: 'portfolio/habilidades',
    mode: 'contract',
    category: 'accessibility',
    requirements: ['FR-012'],
    description:
      'Se eliminan únicamente las puntuaciones en estrellas; se conservan los nombres, el orden y los grupos de habilidades.',
    affectedState:
      'Índice de Habilidades en Rioja a 1440 × 900, con la conversación desplazada hasta el final.',
    anchors: [
      {
        name: 'conversation-viewport',
        selector: 'main',
        golden: { x: 0, y: 64 },
        fields: ['x', 'y', 'width'],
      },
      {
        name: 'backend-skill-group',
        selector: '.skills-catalog__group:nth-child(3) h2',
        golden: { x: 383, y: 194 },
        fields: ['x', 'y'],
      },
      {
        name: 'persistent-query',
        selector: '[data-visual-anchor="query"]',
        golden: { x: 300, y: 641 },
        fields: ['x', 'y'],
      },
    ],
    excludedRegions: [
      {
        id: 'skill-rating-column',
        description: 'Solo la columna de estrellas de puntuación, a la derecha de los nombres de habilidad.',
        boxes: [{ x: 662, y: 60, width: 88, height: 470 }],
      },
    ],
    beforeEvidence: 'design/screenshots/portfolio/habilidades.png',
    afterEvidence: 'artifacts/spec-000/scenes/habilidades/candidate.png',
    approval: 'pending-human-review',
  },
  {
    scene: 'portfolio/articulo-langgraph',
    mode: 'contract',
    category: 'removed-function',
    requirements: ['FR-022', 'FR-026'],
    description:
      'Se conserva la lectura editorial del artículo y se reemplaza solo la etiqueta que afirmaba indexación automatizada.',
    affectedState: 'Permalink del artículo LangGraph en Rioja, con la parte superior del artículo visible.',
    anchors: [
      {
        name: 'article-navigation',
        selector: '.article-header',
        golden: { x: 0, y: 0, width: 1440 },
        fields: ['x', 'y', 'width'],
      },
      {
        name: 'article-body',
        selector: '[data-visual-anchor="article"]',
        golden: { x: 360, y: 108, width: 720 },
        fields: ['x', 'y', 'width'],
      },
      {
        name: 'article-title',
        selector: '.article-content h1',
        golden: { x: 360, y: 154 },
        fields: ['x', 'y'],
      },
    ],
    excludedRegions: [
      {
        id: 'automated-index-claim',
        description:
          'La etiqueta del golden que afirma indexación automatizada; la candidata comunica únicamente el estado publicado.',
        boxes: [{ x: 580, y: 108, width: 190, height: 25 }],
      },
    ],
    beforeEvidence: 'design/screenshots/portfolio/articulo-langgraph.png',
    afterEvidence: 'artifacts/spec-000/scenes/articulo-langgraph/candidate.png',
    approval: 'pending-human-review',
  },
] as const;

export const allowedContractScenes = new Set(['portfolio/habilidades', 'portfolio/articulo-langgraph']);

export const validateVisualExceptions = () => {
  if (visualExceptions.length !== allowedContractScenes.size)
    throw new Error('Número de excepciones visuales inesperado.');
  for (const exception of visualExceptions) {
    if (!allowedContractScenes.has(exception.scene))
      throw new Error(`Excepción fuera de catálogo: ${exception.scene}`);
    if (exception.mode !== 'contract' || !exception.description || !exception.affectedState)
      throw new Error(`Excepción incompleta: ${exception.scene}`);
    if (
      !exception.anchors.length ||
      exception.anchors.some(
        (anchor) => !anchor.selector || (anchor.fields as readonly string[]).length === 0,
      )
    )
      throw new Error(`Anclajes de componente incompletos: ${exception.scene}`);
    if (
      !exception.excludedRegions.length ||
      exception.excludedRegions.some((region) => !region.description || !region.boxes.length)
    )
      throw new Error(`Región exceptuada sin justificación o geometría: ${exception.scene}`);
    if (!exception.beforeEvidence || !exception.afterEvidence || !exception.approval)
      throw new Error(`Evidencia o aprobación ausente: ${exception.scene}`);
  }
};
