import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@contexts/toastContext";
import { UserContext } from "../App";
import LightningBoltIcon from "../components/minor-components/icons/LightningBoltIcon";
import MapPinIcon from "../components/minor-components/icons/MapPinIcon";
import ShieldHalvedIcon from "../components/minor-components/icons/ShieldHalvedIcon";
import styles from "./css/Home.module.css";

export default function Home() {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const { addToast } = useToast();

  const handleGuestBypass = async () => {
    addToast("Logged in as guest user!", "success");
    localStorage.setItem("token", "Gu3$t");
    setUser({ username: "Guest" });

    navigate("/Dashboard");
  };

  return (
    <div className={styles.wrapper}>
      <header className={styles.heroSection}>
        <div className={styles.heroContent}>
          <span className={styles.badge}>JobsiteSync</span>

          <h1 className={styles.heroTitle}>
            Eliminate Material Fragmentation Across Your Active Jobsites
          </h1>

          <p className={styles.heroSubtitle}>
            A centralized, full-stack management system designed to track what
            inventory you have available, exactly where it is stored, and who
            handled it last.
          </p>

          <div className={styles.buttonGroup}>
            <button onClick={handleGuestBypass} className={styles.primaryBtn}>
              Launch Guest Demo
            </button>

            <button
              onClick={() => navigate("/login")}
              className={styles.secondaryBtn}
            >
              Administrator Login
            </button>
          </div>
        </div>
      </header>

      <section className={styles.problemSection}>
        <div className={styles.sectionHeader}>
          <h2>The Operational Bottleneck</h2>
          <p>
            Why modern construction crews lose profit margins to material
            management friction.
          </p>
        </div>

        <div className={styles.problemGrid}>
          <div className={styles.problemCard}>
            <h4>Fragmented Paper Logs</h4>

            <p>
              Relying on loose intake clipboards and scattered text messages
              leads to severe material inaccuracies and accidental reorders.
            </p>
          </div>

          <div className={styles.problemCard}>
            <h4>Blind Storage Locations</h4>

            <p>
              Knowing you have available resources is useless if your team
              spends hours searching the wrong storage areas trying to
              physically locate them.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.solutionSection}>
        <div className={styles.sectionHeader}>
          <h2>Designed for High-Velocity Logistics</h2>

          <p>
            A robust asset engine engineered to handle complex field operations
            without performance compromises.
          </p>
        </div>

        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <div className={styles.iconBox}>
              <LightningBoltIcon className={styles.lightningbolt} />
            </div>

            <h3>Lag-Free Bulk Updating</h3>

            <p>
              Modify quantities and storage notes directly within your data
              grid. Changes process asynchronously in the background, updating
              your active workspace instantly without disruptive full-page
              loader delays.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.iconBox}>
              <MapPinIcon className={styles.mapPinIcon} />
            </div>

            <h3>Sub-Location Allocation</h3>

            <p>
              Eliminate blind spots. Track inventory down to specific storage
              yards, sheds, bins, or containers using a strict relational model
              that guarantees your counts stay perfectly aligned across
              multi-tiered sites.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.iconBox}>
              <ShieldHalvedIcon className={styles.shieldIcon} />
            </div>

            <h3>Fail-Safe Material Guards</h3>

            <p>
              Protect your operational history from human error. Integrated
              server-side validation blocks blank submissions, intercepts
              accidental bulk deletions, and stops duplicate record corruption
              automatically.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
