<template>
  <div class="about-page">
    <div class="container">
      <header class="page-header">
        <h1 class="page-title">
          <span class="title-super">The Architect</span>
          Joshua Mercy
        </h1>
      </header>

      <div class="page-content">
        <!-- Left Column: The Image -->
        <aside class="image-column">
          <figure class="portrait">
            <img src="https://res.cloudinary.com/ddfa67uba/image/upload/v1750408031/tj_axdxu6.jpg" alt="A portrait of Joshua Mercy">
            <figcaption>Nairobi, Kenya</figcaption>
          </figure>
        </aside>

        <!-- Right Column: The Philosophy & Statement -->
        <div class="text-column">
          <p class="lead-paragraph">
            I am a developer and architect with a fundamental belief: exceptional digital work is not merely branded, it is built. My portfolio is the primary testament to a philosophy rooted in structured efficiency and timeless design.
          </p>
          <p>
            At 25, my focus is on translating complex problems into harmonious, effective solutions. I approach each project—from robust software applications to intuitive websites—with a dedication to the craft itself. The process is one of precision, curiosity, and a commitment to creating digital experiences that are not only functional but also possess an inherent, structural beauty.
          </p>
          <p>
            My work is my brand. It is a direct reflection of a process that values clarity over clutter, and enduring quality over fleeting trends. I build for the web of tomorrow, grounded in the principles that have always defined great architecture.
          </p>
          <a href="/services" class="cta-link" @click.prevent="$router.push('/services')">Explore My Services & Process →</a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.about-page {
  padding: 6rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 4rem;
}

.page-header {
  text-align: center;
  margin-bottom: 6rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #e0e0e0;
}
.page-title {
  margin: 0;
}
.title-super {
  display: block;
  font-family: var(--font-body);
  font-size: 1rem;
  font-weight: 400;
  color: var(--color-muted);
  text-transform: uppercase;
  letter-spacing: 0.2em;
  margin-bottom: 0.5rem;
}

.page-content {
  display: grid;
  grid-template-columns: 1fr 2fr; /* Asymmetrical "Colonnade" layout */
  gap: 5rem;
  align-items: flex-start;
}

/* Image Column */
.image-column {
  position: sticky;
  top: 140px; /* Stick below the header */
}

.portrait {
  margin: 0;
}

.portrait img {
  width: 100%;
  height: auto;
  display: block;
  filter: grayscale(80%); /* A sophisticated, classic effect */
  transition: filter 0.4s ease;
}

.portrait img:hover {
  filter: grayscale(0%);
}

.portrait figcaption {
  font-family: var(--font-body);
  font-style: italic;
  font-size: 0.9rem;
  color: var(--color-muted);
  text-align: right;
  margin-top: 1rem;
}

/* Text Column */
.lead-paragraph {
  font-size: 1.5rem;
  line-height: 1.7;
  font-weight: 400;
  margin-top: 0;
}

.text-column p {
  font-size: 1.15rem;
  line-height: 1.8;
}

.cta-link {
  display: inline-block;
  margin-top: 2rem;
  font-weight: 600;
  text-decoration: none;
  border-bottom: 2px solid var(--color-primary);
  padding-bottom: 0.25rem;
}

@media (max-width: 900px) {
  .page-content {
    grid-template-columns: 1fr;
  }
  .image-column {
    position: static;
    max-width: 350px;
    margin: 0 auto 4rem auto;
  }
}
</style>