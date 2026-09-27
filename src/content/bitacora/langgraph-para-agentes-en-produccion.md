---
title: Cómo evalué tres frameworks de agentes antes de elegir LangGraph
slug: langgraph-para-agentes-en-produccion
description: Evaluación de CrewAI, AutoGen y LangGraph para agentes en producción.
excerpt: Probé CrewAI, AutoGen y LangGraph durante tres semanas. Elegí el que me permite depurar con más control cuando algo falla en producción.
category: Agentes
publishedAt: 2025-05-15
author: Rodrigo Valdelvira
authorId: rodrigo-valdelvira
status: published
readingMinutes: 3
---

Cuando empecé a construir el agente de voz de Leadia, la elección del framework de orquestación era más importante de lo que parecía a primera vista. No es solo una decisión técnica: define cómo depuras, cómo escalas y cuánto control real tienes sobre el comportamiento del agente en producción.

Evalué tres opciones durante tres semanas: **CrewAI**, **AutoGen** y **LangGraph**. El criterio no fue cuál tenía más estrellas en GitHub, sino cuál me dejaba depurar eficientemente cuando algo salía mal.

## CrewAI: excelente para prototipar, insuficiente para producción

La abstracción de agentes con roles encaja bien con la forma en que pensamos sobre delegación de tareas. Para validar una idea en horas, es difícil batirlo. Pero cuando algo falla en producción, hay demasiada magia implícita en la orquestación. El nivel de abstracción que lo hace rápido de usar es el mismo que lo hace difícil de depurar.

## AutoGen: potente, pero el modelo mental no encajaba

El enfoque multiagente de Microsoft es muy potente para conversaciones entre agentes. Pero el modelo de agentes que se mandan mensajes no encajaba bien con los flujos estructurados que necesitaba para Leadia. Depurar una conversación entre tres agentes cuando el flujo se rompe en el paso 7 es más lento de lo que debería.

## LangGraph: estado explícito, control real

LangGraph ganó por una razón concreta: el estado es un `TypedDict` explícito y las transiciones del grafo son declarativas. Cuando algo falla, puedo ver exactamente qué nodo recibió qué estado y por qué tomó esa transición.

```python
class AgentState(TypedDict):
    messages: list
    lead_data: dict
    next_step: str
```

> La trazabilidad no es un lujo en producción: es el primer requisito para poder mejorar un agente que ya responde a usuarios reales.

## Conclusión

Tres meses después de la decisión, no me arrepiento. LangGraph no es el framework más fácil de empezar —la curva de aprendizaje es real—, pero es el que más control me ha dado cuando algo ha fallado. Y en producción, los errores siempre llegan.

Si estás eligiendo framework para producción, primero define cuánto control de depuración necesitas. Si estás validando una idea, CrewAI es estupendo. Si vas a producción con usuarios reales y quieres poder mejorar el sistema de forma sistemática, LangGraph vale la inversión.
