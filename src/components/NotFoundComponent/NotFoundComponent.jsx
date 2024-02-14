import styles from "./NotFoundComponent.module.css";

export default function NotFoundComponent() {
  return (
    <div className={styles.notFound}>
      <div className={styles.notFoundImg}>
        <img src="https://res.cloudinary.com/hoyahoya/image/upload/v1703133861/letter/basic-html-404-error_b0ch5d.webp" />
      </div>
    </div>
  );
}
