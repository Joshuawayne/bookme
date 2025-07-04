<template>
  <!-- Container for decrypted text with mouse and accessibility handlers -->
  <span
    :class="parentClassName"
    ref="containerRef"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    v-bind="$attrs"
    class="decrypted-text"
  >
    <!-- Screen reader accessible text -->
    <span class="sr-only">{{ displayText }}</span>
    <!-- Visual text with per-character animation -->
    <span aria-hidden="true">
      <span
        v-for="(char, index) in displayText"
        :key="index"
        :class="isRevealedOrDone(index) ? className : encryptedClassName"
        class="decrypted-char"
      >
        {{ char }}
      </span>
    </span>
  </span>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'

// Define component props with clear validation and defaults
const props = defineProps({
  text: {
    type: String,
    required: true,
    // Purpose: The text to be decrypted and displayed
  },
  speed: {
    type: Number,
    default: 50,
    // Purpose: Animation speed in milliseconds per iteration
  },
  maxIterations: {
    type: Number,
    default: 10,
    // Purpose: Maximum number of shuffle iterations for non-sequential animation
  },
  sequential: {
    type: Boolean,
    default: false,
    // Purpose: Determines if characters reveal one-by-one or all at once
  },
  revealDirection: {
    type: String,
    default: 'start',
    validator: (value) => ['start', 'end', 'center'].includes(value),
    // Purpose: Direction of sequential reveal (start, end, or center)
  },
  useOriginalCharsOnly: {
    type: Boolean,
    default: false,
    // Purpose: If true, shuffles only with characters from the input text
  },
  characters: {
    type: String,
    default: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+',
    // Purpose: Character set for shuffling when useOriginalCharsOnly is false
  },
  className: {
    type: String,
    default: '',
    // Purpose: CSS class for revealed characters
  },
  parentClassName: {
    type: String,
    default: '',
    // Purpose: CSS class for the parent container
  },
  encryptedClassName: {
    type: String,
    default: '',
    // Purpose: CSS class for encrypted (unrevealed) characters
  },
  animateOn: {
    type: String,
    default: 'hover',
    validator: (value) => ['hover', 'view'].includes(value),
    // Purpose: Trigger for animation (hover or when in view)
  }
})

// Reactive state for managing text display and animation
const displayText = ref(props.text) // Current displayed text
const isHovering = ref(false) // Tracks hover state for animation trigger
const isScrambling = ref(false) // Tracks if animation is in progress
const revealedIndices = ref(new Set()) // Indices of revealed characters
const hasAnimated = ref(false) // Prevents re-animation for 'view' mode
const containerRef = ref(null) // Reference to the container element

// Updates the set of revealed indices
const setRevealedIndices = (newSet) => {
  revealedIndices.value = new Set(newSet)
}

// Determines the next index to reveal based on direction
const getNextIndex = (revealedSet) => {
  const textLength = props.text.length
  switch (props.revealDirection) {
    case 'start':
      return revealedSet.size // Reveal from the beginning
    case 'end':
      return textLength - 1 - revealedSet.size // Reveal from the end
    case 'center': {
      const middle = Math.floor(textLength / 2)
      const offset = Math.floor(revealedSet.size / 2)
      const nextIndex =
        revealedSet.size % 2 === 0
          ? middle + offset
          : middle - offset - 1

      // Return next unrevealed index or fallback to first available
      if (nextIndex >= 0 && nextIndex < textLength && !revealedSet.has(nextIndex)) {
        return nextIndex
      }
      for (let i = 0; i < textLength; i++) {
        if (!revealedSet.has(i)) return i
      }
      return 0
    }
    default:
      return revealedSet.size // Fallback to start
  }
}

// Computes available characters for shuffling
const availableChars = computed(() =>
  props.useOriginalCharsOnly
    ? Array.from(new Set(props.text.split(''))).filter((char) => char !== ' ')
    : props.characters.split('')
)

// Shuffles text, preserving spaces and revealed characters
const shuffleText = (originalText, currentRevealed) => {
  if (props.useOriginalCharsOnly) {
    const positions = originalText.split('').map((char, i) => ({
      char,
      isSpace: char === ' ',
      index: i,
      isRevealed: currentRevealed.has(i),
    }))

    const nonSpaceChars = positions
      .filter((p) => !p.isSpace && !p.isRevealed)
      .map((p) => p.char)

    // Shuffle non-space, unrevealed characters
    for (let i = nonSpaceChars.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      [nonSpaceChars[i], nonSpaceChars[j]] = [nonSpaceChars[j], nonSpaceChars[i]]
    }

    let charIndex = 0
    return positions
      .map((p) => {
        if (p.isSpace) return ' '
        if (p.isRevealed) return originalText[p.index]
        return nonSpaceChars[charIndex++]
      })
      .join('')
  } else {
    return originalText
      .split('')
      .map((char, i) => {
        if (char === ' ') return ' '
        if (currentRevealed.has(i)) return originalText[i]
        return availableChars.value[Math.floor(Math.random() * availableChars.value.length)]
      })
      .join('')
  }
}

// Checks if a character is revealed or animation is complete
const isRevealedOrDone = (index) => {
  return revealedIndices.value.has(index) || !isScrambling.value || !isHovering.value
}

// Handles mouse enter event to trigger animation
const handleMouseEnter = () => {
  if (props.animateOn === 'hover') {
    isHovering.value = true
  }
}

// Handles mouse leave event to reset animation
const handleMouseLeave = () => {
  if (props.animateOn === 'hover') {
    isHovering.value = false
    revealedIndices.value = new Set()
    displayText.value = props.text
  }
}

// Sets up animation and visibility observer
onMounted(() => {
  let interval
  let currentIteration = 0

  // Starts the text scrambling animation
  const startAnimation = () => {
    if (!isHovering.value) {
      displayText.value = props.text
      revealedIndices.value = new Set()
      isScrambling.value = false
      return
    }

    isScrambling.value = true
    interval = setInterval(() => {
      const prevRevealed = revealedIndices.value
      if (props.sequential) {
        if (prevRevealed.size < props.text.length) {
          const nextIndex = getNextIndex(prevRevealed)
          const newRevealed = new Set(prevRevealed)
          newRevealed.add(nextIndex)
          displayText.value = shuffleText(props.text, newRevealed)
          setRevealedIndices(newRevealed) // Update revealed indices
        } else {
          clearInterval(interval)
          isScrambling.value = false
        }
      } else {
        displayText.value = shuffleText(props.text, prevRevealed)
        currentIteration++
        if (currentIteration >= props.maxIterations) {
          clearInterval(interval)
          isScrambling.value = false
          displayText.value = props.text
        }
      }
    }, props.speed)
  }

  // Observe visibility for 'view' animation trigger
  if (props.animateOn === 'view') {
    const observer = new IntersectionObserver(
      ([{ isIntersecting }]) => {
        if (isIntersecting && !hasAnimated.value) {
          isHovering.value = true
          hasAnimated.value = true
          startAnimation()
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(containerRef.value)

    // Cleanup observer on component unmount
    onUnmounted(() => {
      observer.disconnect()
    })
  }

  // Cleanup interval on component unmount
  return () => {
    if (interval) clearInterval(interval)
  }
})
</script>

<style scoped>
/* Hides content for screen readers while keeping it accessible */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}

/* Styles the container for decrypted text */
.decrypted-text {
  display: block;
  width: 100%;
}

/* Styles individual characters */
.decrypted-char {
  display: inline;
  position: relative;
}

/* Ensures proper text wrapping for animated characters */
span[aria-hidden="true"] {
  display: inline;
  white-space: pre-wrap;
}
</style>
