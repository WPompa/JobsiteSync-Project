import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@contexts/ToastContext";
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
            Stop Losing Track of Your Materials and Quantities
          </h1>

          <p className={styles.heroSubtitle}>
            A jobsite logistics system built to track exactly what inventory you
            have available, where it is stored, and who moved it last.
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
          <h2>The Hidden Cost of Messy Logistics</h2>
          <p>
            How loose tracking and poor field coordination drain project
            margins.
          </p>
        </div>

        <div className={styles.problemGrid}>
          <div className={styles.problemCard}>
            <h4>Scattered Paper Logs</h4>

            <p>
              Relying on loose intake sheets and scattered text messages leads
              to severe, chronic material inaccuracies and expensive reorders.
            </p>
          </div>

          <div className={styles.problemCard}>
            <h4>Blind Storage Locations</h4>

            <p>
              Knowing an item is "somewhere in the yard" is useless if your crew
              wastes hours searching through the wrong storage bins to
              physically locate it.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.solutionSection}>
        <div className={styles.sectionHeader}>
          <h2>Built for Real-World Construction Logistics</h2>

          <p>
            An easy to use logistics system engineered to handle your typical
            jobsite operations without the administrative friction.
          </p>
        </div>

        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <div className={styles.iconBox}>
              <LightningBoltIcon className={styles.lightningbolt} />
            </div>

            <h3>Single-Screen Row And Bulk Edits</h3>

            <p>
              Update stock quantities, log material changes, and edit multiple
              line items instantly from a single screen. No lag or slow page
              reloads, ensuring your back office can keep pace with fast-moving
              field crews and delivery schedules.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.iconBox}>
              <MapPinIcon className={styles.mapPinIcon} />
            </div>

            <h3>Multi-Site & Bin-Level Tracking</h3>

            <p>
              Eliminate yard chaos. Track your material allocations down to
              specific laydown yards, storage sheds, individual bins, or jobsite
              containers. Maintain precise quantities across all active projects
              so crews never waste hours hunting for what they need.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.iconBox}>
              <ShieldHalvedIcon className={styles.shieldIcon} />
            </div>

            <h3>Admin Controls & Audit Trails</h3>

            <p>
              Protect your material history from accidental overrides and human
              error. Enforce strict permissions for bulk adjustments, lock down
              critical deletion rights to authorized coordinators, and maintain
              a permanent audit log of every stock change for individual
              accountability.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
