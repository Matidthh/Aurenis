# DESIGN SYSTEM DE LUCAS — ESPECIFICACIÓN TÉCNICA & GUÍA DE ACCESIBILIDAD (AURENIS v1.0)

**Autor/Diseñador:** Lucas  
**Implementador:** Malcom S  
**Fecha:** 2026-09-10  
**Cumplimiento de Accesibilidad:** WCAG 2.1 Nivel AA / AAA  

---

## 1. Misión y Filosofía de Diseño

El **Design System de Lucas** define las bases visuales, componentes de interfaz e interacciones de **Aurenis** para garantizar coherencia, solidez y accesibilidad en todos los módulos académicos y administrativos.

Principios rectores:
1. **Accesibilidad Primero (A11Y):** Todo componente interactivo dispone de foco visible sin excepción, etiquetas semánticas y ratio de contraste validado según las pautas WCAG 2.1 AA (mínimo 4.5:1 para texto estándar y 3.0:1 para componentes de interfaz).
2. **Mobile First & Touch Ready:** Cada botón o elemento interactivo garantiza un área de contacto mínima de **44 × 44 px** en pantallas táctiles (WCAG 2.5.5).
3. **Composición Modular:** Arquitectura de componentes desacoplados exportados desde `@/components/ui`.

---

## 2. Paleta Cromática y Validación de Contraste WCAG 2.1

### 2.1. Brand / Azul Institucional Aurenis

| Token | Hex | Contraste con Blanco (#FFF) | Contraste con Fondo Oscuro (#090D16) | Evaluación WCAG | Uso Recomendado |
| :--- | :--- | :---: | :---: | :---: | :--- |
| `brand-50` | `#f0f7ff` | 1.07:1 | 18.2:1 | PASS AAA (con texto oscuro) | Fondos de badges y filas activas |
| `brand-100` | `#e0effe` | 1.18:1 | 16.5:1 | PASS AAA (con texto oscuro) | Contenedores suaves e iconos |
| `brand-500` | `#0c8ee9` | 3.45:1 | 5.64:1 | PASS AA (Iconos y UI grande) | Acentos interactivos y bordes activos |
| **`brand-600`** | **`#016fc7`** | **4.82:1** | 4.04:1 | **PASS AA (Texto blanco)** | **Botones primarios principales** |
| **`brand-700`** | **`#0258a1`** | **6.75:1** | 2.88:1 | **PASS AAA (Texto blanco)** | **Hover de botones y títulos oscuros** |
| `brand-900` | `#0b3f6f` | 10.4:1 | 1.87:1 | PASS AAA (Texto blanco) | Cabeceras institucionales y modo oscuro |

### 2.2. Paleta de Estados y Semántica

| Estado | Token | Superficie (`bg`) | Borde (`border`) | Texto (`text`) | Sólido (`btn/dot`) | Ratio WCAG |
| :--- | :--- | :--- | :--- | :--- | :--- | :---: |
| **Éxito / Aprobado** | `success` | `#ecfdf5` (`emerald-50`) | `#a7f3d0` | `#047857` (`emerald-700`) | `#059669` | **4.8:1 (PASS AA)** |
| **Advertencia / Alerta** | `warning` | `#fffbeb` (`amber-50`) | `#fde68a` | `#b45309` (`amber-700`) | `#d97706` | **4.7:1 (PASS AA)** |
| **Peligro / Rechazado** | `danger` | `#fef2f2` (`red-50`) | `#fecaca` | `#b91c1c` (`red-700`) | `#dc2626` | **5.2:1 (PASS AA)** |
| **Neutral / Inactivo** | `neutral` | `#f1f5f9` (`slate-100`) | `#e2e8f0` | `#334155` (`slate-700`) | `#64748b` | **9.4:1 (PASS AAA)** |

---

## 3. Escala Tipográfica y Tokens de Espaciado

### 3.1. Tipografía (Base 16px / Major Second)
* **`text-2xl font-bold` (Display / 24px - 32px):** Títulos de páginas principales (`PageHeader`).
* **`text-xl font-bold` (H1 / 20px - 24px):** Encabezados de tarjetas y secciones.
* **`text-lg font-semibold` (H2 / 18px - 20px):** Títulos de modales (`ModalTitle`).
* **`text-sm font-medium` (Body / 14px):** Texto estándar de lectura, celdas de tabla y formularios.
* **`text-xs font-semibold` (Micro / 12px):** Badges, encabezados de columnas de tabla (`TableHead`) y ayudas (`helperText`).

### 3.2. Espaciados Estandarizados (Línea Base de 4px)
* `p-1` (4px) / `p-2` (8px): Microespaciados para botones de icono y badges.
* `p-3` (12px) / `p-4` (16px): Relleno estándar para inputs y botones.
* `p-5` (20px) / `p-6` (24px): Relleno de tarjetas, modales y cabeceras.
* `space-y-6` (24px): Separación modular entre bloques principales de contenido.

---

## 4. Catálogo de Componentes Base para Malcom S

Todos los componentes se importan directamente desde:
```tsx
import { 
  Button, 
  Input, 
  Textarea, 
  Badge, 
  Modal, ModalHeader, ModalTitle, ModalDescription, ModalBody, ModalFooter,
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableEmptyState, TablePagination
} from "@/components/ui";
```

### 4.1. Botones (`Button`)
Admite 6 variantes (`primary`, `secondary`, `outline`, `ghost`, `danger`, `success`) y 4 tamaños (`sm`, `md`, `lg`, `icon`):

```tsx
// Botón Primario con icono y estado de carga automático
<Button 
  variant="primary" 
  size="md"
  leftIcon={<Plus className="w-4 h-4" />}
  isLoading={isSubmitting}
  loadingText="Guardando..."
  onClick={handleSave}
>
  Registrar Alumno
</Button>

// Botón de Peligro para eliminación
<Button variant="danger" size="sm" onClick={handleDelete}>
  Eliminar Asignatura
</Button>
```

### 4.2. Inputs y Formularios (`Input` y `Textarea`)
Maneja etiquetas obligatorias, textos de asistencia y mensajes de error con asociación semántica accesible (`aria-invalid` y `aria-describedby`):

```tsx
<Input
  label="RUT del Estudiante"
  required
  placeholder="12.345.678-9"
  leftIcon={<CreditCard className="w-4 h-4" />}
  error={errors.rut}
  helperText="Formato sin puntos y con guión verificador."
  value={rut}
  onChange={(e) => setRut(e.target.value)}
/>
```

### 4.3. Etiquetas de Estado (`Badge`)
Badges accesibles con soporte para indicador de punto (`dot`), animación de pulsación (`dotPulse`) y botón de eliminación (`onRemove`):

```tsx
// Estado Activo con punto verde pulsante
<Badge variant="success" dot dotPulse>
  Presente
</Badge>

// Estado Pendiente
<Badge variant="warning" dot>
  Pendiente de Justificación
</Badge>
```

### 4.4. Diálogos Modales (`Modal`)
Diálogo accesible con bloqueo automático de scroll, cierre con tecla `Escape` y panel responsivo (Bottom-Sheet en móviles y ventana flotante centrada en escritorio):

```tsx
<Modal isOpen={isOpen} onClose={() => setIsOpen(false)} size="md">
  <ModalHeader>
    <ModalTitle>Editar Datos del Alumno</ModalTitle>
    <ModalDescription>Actualiza el correo y teléfono del apoderado.</ModalDescription>
  </ModalHeader>
  <ModalBody>
    <Input label="Correo del Apoderado" type="email" />
  </ModalBody>
  <ModalFooter>
    <Button variant="outline" onClick={() => setIsOpen(false)}>Cancelar</Button>
    <Button variant="primary" onClick={handleConfirm}>Guardar Cambios</Button>
  </ModalFooter>
</Modal>
```

### 4.5. Tablas Accesibles (`Table`)
Estructura semántica con `scope="col"`, efecto hover, soporte para estados vacíos y barra de paginación integrada:

```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Estudiante</TableHead>
      <TableHead>RUT</TableHead>
      <TableHead>Curso</TableHead>
      <TableHead align="right">Promedio</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {students.map((st) => (
      <TableRow key={st.id}>
        <TableCell className="font-medium text-slate-900">{st.name}</TableCell>
        <TableCell>{st.rut}</TableCell>
        <TableCell>{st.course}</TableCell>
        <TableCell align="right" className="font-bold text-brand-600">{st.grade}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

---

## 5. Pautas de Accesibilidad Obligatorias para la Implementación

1. **Foco Visible (Focus Ring):**
   Todos los elementos interactivos deben mantener el token de foco:
   `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2`.
2. **Formularios Semánticos:**
   Todo input debe poseer `label` o un atributo `aria-label`. Los mensajes de error deben emitir `role="alert"`.
3. **Contrastes en Texto:**
   Nunca usar texto gris claro (`slate-400`) sobre fondos claros. Utilizar siempre `slate-500` o `slate-600` para garantizar el ratio mínimo de 4.5:1.
4. **Navegación por Teclado:**
   Los modales y menús deben ser operables completamente mediante `Tab`, `Shift+Tab`, `Enter` y `Escape`.
