// Tableau des personnes
let personnes = [];

// Initialiser au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    // Initialiser le mois et l'exemple
    initialiserMoisActuel();
    chargerExemple();

    // Afficher le guide par défaut au premier chargement
    if (!localStorage.getItem('guide_seen')) {
        setTimeout(() => {
            toggleGuide();
            localStorage.setItem('guide_seen', 'true');
        }, 800);
    }

    // ===== ÉVÉNEMENTS DE FERMETURE DU MODAL =====

    // Événement pour le bouton X en haut
    const btnCloseModal = document.getElementById('btnCloseModal');
    if (btnCloseModal) {
        btnCloseModal.addEventListener('click', fermerHistorique);
    }

    // Événement pour le bouton Fermer en bas
    const btnCloseModalFooter = document.getElementById('btnCloseModalFooter');
    if (btnCloseModalFooter) {
        btnCloseModalFooter.addEventListener('click', fermerHistorique);
    }

    // Événement pour cliquer sur le backdrop (fond noir)
    const modalElement = document.getElementById('historiqueModal');
    if (modalElement) {
        modalElement.addEventListener('click', function(event) {
            // Si on clique directement sur le modal (pas sur le contenu)
            if (event.target === modalElement) {
                fermerHistorique();
            }
        });

        // Événement pour la touche Escape
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') {
                const modalInstance = bootstrap.Modal.getInstance(modalElement);
                if (modalInstance && modalElement.classList.contains('show')) {
                    fermerHistorique();
                }
            }
        });
    }
});

// ========== SYSTEME DE TOAST NOTIFICATIONS ==========

function showToast(title, message, type = 'info') {
    const toastContainer = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        info: 'fa-info-circle',
        warning: 'fa-exclamation-triangle'
    };

    toast.innerHTML = `
        <i class="fas ${icons[type]} toast-icon"></i>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            ${message ? `<div class="toast-message">${message}</div>` : ''}
        </div>
        <button class="toast-close" onclick="closeToast(this)">
            <i class="fas fa-times"></i>
        </button>
    `;

    toastContainer.appendChild(toast);

    // Auto-close après 5 secondes
    setTimeout(() => {
        closeToast(toast.querySelector('.toast-close'));
    }, 5000);
}

function closeToast(button) {
    const toast = button.closest('.toast');
    toast.classList.add('removing');
    setTimeout(() => {
        toast.remove();
    }, 300);
}

// ========== TOGGLE GUIDE ==========

function toggleGuide() {
    const content = document.getElementById('guideContent');
    const toggle = document.getElementById('guideToggle');

    if (content.classList.contains('expanded')) {
        content.classList.remove('expanded');
        toggle.classList.remove('rotated');
    } else {
        content.classList.add('expanded');
        toggle.classList.add('rotated');
    }
}

// Initialiser le mois actuel automatiquement
function initialiserMoisActuel() {
    const maintenant = new Date();
    const annee = maintenant.getFullYear();
    const mois = String(maintenant.getMonth() + 1).padStart(2, '0');
    const moisValue = `${annee}-${mois}`;

    document.getElementById('moisInput').value = moisValue;
    updateMoisLabel();
}

// Mettre à jour le label du mois
function updateMoisLabel() {
    const moisInput = document.getElementById('moisInput');
    const moisDisplay = document.getElementById('moisDisplay');
    const moisHidden = document.getElementById('mois');

    if (moisInput.value) {
        const [annee, mois] = moisInput.value.split('-');
        const moisNoms = [
            'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
            'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
        ];

        const moisTexte = `${moisNoms[parseInt(mois) - 1]} ${annee}`;
        moisDisplay.textContent = moisTexte;
        moisDisplay.classList.add('active');
        moisHidden.value = moisTexte;
    } else {
        moisDisplay.classList.remove('active');
        moisHidden.value = '';
    }
}

// Ajouter une personne
function ajouterPersonne(nom = '', ancienIndex = '', nouvelIndex = '') {
    const personne = {
        id: Date.now() + Math.random(),
        nom: nom,
        ancienIndex: ancienIndex,
        nouvelIndex: nouvelIndex,
        conso: 0,
        montant: 0
    };

    personnes.push(personne);
    afficherPersonnes();
}

// Afficher les personnes (format mobile avec cartes)
function afficherPersonnes() {
    const container = document.getElementById('listePersonnes');
    container.innerHTML = '';

    personnes.forEach((personne, index) => {
        const card = document.createElement('div');
        card.className = 'personne-card';
        card.innerHTML = `
            <div class="personne-card-header">
                <div class="personne-nom-readonly">
                    <i class="fas fa-user-circle me-2"></i>
                    <span>${personne.nom}</span>
                </div>
            </div>
            <div class="personne-inputs">
                <div class="input-group-mobile">
                    <label><i class="fas fa-arrow-down me-1"></i>Ancien index</label>
                    <input type="number" value="${personne.ancienIndex}" onchange="updatePersonne(${index}, 'ancienIndex', this.value)" step="0.1" placeholder="0.0" inputmode="decimal">
                </div>
                <div class="input-group-mobile">
                    <label><i class="fas fa-arrow-up me-1"></i>Nouvel index</label>
                    <input type="number" value="${personne.nouvelIndex}" onchange="updatePersonne(${index}, 'nouvelIndex', this.value)" step="0.1" placeholder="0.0" inputmode="decimal">
                </div>
            </div>
            <div class="personne-results">
                <div class="result-item">
                    <div class="result-label"><i class="fas fa-bolt me-1"></i>Consommation</div>
                    <div class="result-value">${personne.conso.toFixed(1)} kWh</div>
                </div>
                <div class="result-item">
                    <div class="result-label"><i class="fas fa-coins me-1"></i>Montant</div>
                    <div class="result-value">${personne.montant.toLocaleString('fr-FR')} Ar</div>
                </div>
            </div>
            <div class="contact-admin">
                <i class="fas fa-info-circle me-2"></i>
                <span>Pour modifier votre nom, contactez <strong>Mitia</strong></span>
            </div>
        `;
        container.appendChild(card);
    });
}

// Mettre à jour une personne
function updatePersonne(index, champ, valeur) {
    if (champ === 'nom') {
        personnes[index][champ] = valeur;
    } else {
        personnes[index][champ] = parseFloat(valeur) || 0;
    }
    calculerFacture();
}

// Supprimer une personne
function supprimerPersonne(index) {
    if (confirm('Voulez-vous vraiment supprimer cette personne ?')) {
        personnes.splice(index, 1);
        afficherPersonnes();
        calculerFacture();
    }
}

// Calculer la facture
function calculerFacture() {
    const factureTotale = parseFloat(document.getElementById('factureTotale').value) || 0;

    if (factureTotale === 0) {
        // Ne pas afficher d'alerte, juste ne pas calculer
        document.getElementById('resumeCard').style.display = 'none';
        return;
    }

    // Calculer les consommations individuelles
    let totalKwh = 0;
    personnes.forEach(personne => {
        const conso = personne.nouvelIndex - personne.ancienIndex;
        personne.conso = conso < 0 ? 0 : conso;
        totalKwh += personne.conso;
    });

    if (totalKwh === 0) {
        // Ne pas afficher d'alerte, juste ne pas calculer
        document.getElementById('resumeCard').style.display = 'none';
        return;
    }

    // Calculer le prix du kWh
    const prixKwh = factureTotale / totalKwh;

    // Calculer les montants individuels
    let totalMontants = 0;
    personnes.forEach(personne => {
        personne.montant = Math.round(personne.conso * prixKwh);
        totalMontants += personne.montant;
    });

    // Calculer l'écart
    const ecart = factureTotale - totalMontants;

    // Afficher les résultats
    afficherPersonnes();
    afficherResume(totalKwh, prixKwh, totalMontants, ecart);
}

// Afficher le résumé
function afficherResume(totalKwh, prixKwh, totalMontants, ecart) {
    document.getElementById('totalKwh').textContent = totalKwh.toFixed(1);
    document.getElementById('prixKwh').textContent = prixKwh.toFixed(1);
    document.getElementById('totalMontants').textContent = totalMontants.toLocaleString('fr-FR');
    document.getElementById('ecart').textContent = ecart.toFixed(0);

    document.getElementById('resumeCard').style.display = 'block';
}

// Sauvegarder le mois
function sauvegarderMois() {
    const mois = document.getElementById('mois').value.trim();
    const factureTotale = parseFloat(document.getElementById('factureTotale').value) || 0;

    if (!mois) {
        showToast('Mois requis', 'Veuillez sélectionner le mois de la facture', 'warning');
        return;
    }

    if (factureTotale === 0) {
        showToast('Montant requis', 'Veuillez entrer le montant total de la facture', 'warning');
        return;
    }

    if (personnes.length === 0) {
        showToast('Aucune personne', 'Il n\'y a aucune personne à calculer', 'warning');
        return;
    }

    // Calculer les valeurs finales
    let totalKwh = 0;
    personnes.forEach(personne => {
        totalKwh += personne.conso;
    });

    const prixKwh = factureTotale / totalKwh;

    // Créer l'objet à sauvegarder
    const donneesMois = {
        mois: mois,
        facture: factureTotale,
        totalKwh: parseFloat(totalKwh.toFixed(1)),
        prixKwh: parseFloat(prixKwh.toFixed(1)),
        personnes: personnes.map(p => ({
            nom: p.nom,
            ancien: p.ancienIndex,
            nouveau: p.nouvelIndex,
            conso: parseFloat(p.conso.toFixed(1)),
            montant: p.montant
        }))
    };

    // Récupérer l'historique
    let historique = JSON.parse(localStorage.getItem('kwhsplit_historique') || '[]');

    // Vérifier si le mois existe déjà
    const index = historique.findIndex(h => h.mois === mois);
    if (index !== -1) {
        if (confirm(`Le mois "${mois}" existe déjà. Voulez-vous le remplacer ?`)) {
            historique[index] = donneesMois;
        } else {
            return;
        }
    } else {
        historique.push(donneesMois);
    }

    // Sauvegarder dans localStorage
    localStorage.setItem('kwhsplit_historique', JSON.stringify(historique));

    showToast('Sauvegardé !', `Le mois "${mois}" a été enregistré dans l'historique`, 'success');
}

// Afficher l'historique (Section)
function afficherHistorique() {
    const historique = JSON.parse(localStorage.getItem('kwhsplit_historique') || '[]');
    const historiqueSection = document.getElementById('historiqueSection');
    const historiqueContent = document.getElementById('historiqueContent');
    const historiqueCount = document.getElementById('historiqueCount');
    const historiqueBody = document.getElementById('historiqueBody');

    // Mettre à jour le compteur
    historiqueCount.textContent = historique.length === 0 ? 'Aucun mois' :
                                   historique.length === 1 ? '1 mois' :
                                   `${historique.length} mois`;

    if (historique.length === 0) {
        historiqueContent.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📭</div>
                <div class="empty-state-title">Aucun historique</div>
                <div class="empty-state-text">Les mois sauvegardés apparaîtront ici</div>
            </div>
        `;
        historiqueSection.style.display = 'block';
        return;
    }

    historiqueContent.innerHTML = '';

    // Afficher les mois du plus récent au plus ancien
    historique.reverse().forEach((mois, index) => {
        const div = document.createElement('div');
        div.className = 'historique-mois';

        let tableHTML = `
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h6>📅 ${mois.mois}</h6>
                <div>
                    <button class="btn btn-sm btn-primary me-2" onclick="chargerMois(${historique.length - 1 - index})">📥 Charger</button>
                    <button class="btn btn-sm btn-danger" onclick="supprimerMois(${historique.length - 1 - index})">🗑️ Supprimer</button>
                </div>
            </div>
            <div class="row mb-3">
                <div class="col-md-3 col-6"><strong>Facture:</strong> ${mois.facture.toLocaleString('fr-FR')} Ar</div>
                <div class="col-md-3 col-6"><strong>Total kWh:</strong> ${mois.totalKwh}</div>
                <div class="col-md-3 col-6"><strong>Prix/kWh:</strong> ${mois.prixKwh} Ar</div>
                <div class="col-md-3 col-6"><strong>Personnes:</strong> ${mois.personnes.length}</div>
            </div>
            <div class="table-responsive">
                <table class="table table-sm">
                    <thead>
                        <tr>
                            <th>Nom</th>
                            <th>Ancien</th>
                            <th>Nouveau</th>
                            <th>Conso (kWh)</th>
                            <th>Montant (Ar)</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        mois.personnes.forEach(p => {
            tableHTML += `
                <tr>
                    <td>${p.nom}</td>
                    <td>${p.ancien}</td>
                    <td>${p.nouveau}</td>
                    <td>${p.conso}</td>
                    <td>${p.montant.toLocaleString('fr-FR')}</td>
                </tr>
            `;
        });

        tableHTML += `
                    </tbody>
                </table>
            </div>
        `;

        div.innerHTML = tableHTML;
        historiqueContent.appendChild(div);
    });

    // Afficher la section et l'ouvrir automatiquement
    historiqueSection.style.display = 'block';

    // Ouvrir automatiquement la section si elle n'est pas déjà ouverte
    if (!historiqueBody.classList.contains('expanded')) {
        toggleHistoriqueSection();
    }
}

// Toggle de la section historique (expand/collapse)
function toggleHistoriqueSection() {
    const historiqueBody = document.getElementById('historiqueBody');
    const historiqueToggleIcon = document.getElementById('historiqueToggleIcon');

    if (historiqueBody.classList.contains('expanded')) {
        historiqueBody.classList.remove('expanded');
        historiqueToggleIcon.classList.remove('rotated');
    } else {
        historiqueBody.classList.add('expanded');
        historiqueToggleIcon.classList.add('rotated');
    }
}

// Charger un mois depuis l'historique
function chargerMois(index) {
    const historique = JSON.parse(localStorage.getItem('kwhsplit_historique') || '[]');
    const mois = historique[index];

    if (!mois) return;

    // Convertir le mois texte en format YYYY-MM si possible
    const moisNoms = {
        'Janvier': '01', 'Février': '02', 'Mars': '03', 'Avril': '04',
        'Mai': '05', 'Juin': '06', 'Juillet': '07', 'Août': '08',
        'Septembre': '09', 'Octobre': '10', 'Novembre': '11', 'Décembre': '12'
    };

    const moisParts = mois.mois.split(' ');
    if (moisParts.length === 2 && moisNoms[moisParts[0]]) {
        const moisValue = `${moisParts[1]}-${moisNoms[moisParts[0]]}`;
        document.getElementById('moisInput').value = moisValue;
        updateMoisLabel();
    }

    document.getElementById('factureTotale').value = mois.facture;

    personnes = mois.personnes.map(p => ({
        id: Date.now() + Math.random(),
        nom: p.nom,
        ancienIndex: p.ancien,
        nouvelIndex: p.nouveau,
        conso: p.conso,
        montant: p.montant
    }));

    afficherPersonnes();
    calculerFacture();

    // Scroll vers le haut pour voir les données chargées
    window.scrollTo({ top: 0, behavior: 'smooth' });

    showToast('Chargé !', `Les données de "${mois.mois}" ont été chargées`, 'success');
}

// Supprimer un mois de l'historique
function supprimerMois(index) {
    const historique = JSON.parse(localStorage.getItem('kwhsplit_historique') || '[]');
    const mois = historique[index];

    if (confirm(`Voulez-vous vraiment supprimer le mois "${mois.mois}" ?`)) {
        historique.splice(index, 1);
        localStorage.setItem('kwhsplit_historique', JSON.stringify(historique));
        afficherHistorique();
    }
}

// Charger l'exemple de septembre 2025
function chargerExemple() {
    // Mettre à jour le mois input
    document.getElementById('moisInput').value = '2025-09';
    updateMoisLabel();

    document.getElementById('factureTotale').value = '191617';

    personnes = [
        { id: 1, nom: 'Jessica', ancienIndex: 120.0, nouvelIndex: 125.2, conso: 0, montant: 0 },
        { id: 2, nom: 'Narindra', ancienIndex: 200.0, nouvelIndex: 246.3, conso: 0, montant: 0 },
        { id: 3, nom: 'Tahiry', ancienIndex: 150.0, nouvelIndex: 202.0, conso: 0, montant: 0 },
        { id: 4, nom: 'Kambana', ancienIndex: 80.0, nouvelIndex: 115.6, conso: 0, montant: 0 },
        { id: 5, nom: 'Mitia', ancienIndex: 300.0, nouvelIndex: 308.0, conso: 0, montant: 0 },
        { id: 6, nom: 'Lydia', ancienIndex: 50.0, nouvelIndex: 122.6, conso: 0, montant: 0 },
        { id: 7, nom: 'Nathalie', ancienIndex: 400.0, nouvelIndex: 446.1, conso: 0, montant: 0 }
    ];

    afficherPersonnes();
    calculerFacture();
}

// ========== NOUVEAU MOIS - Fonction pour préparer le mois suivant ==========
function nouveauMois() {
    // Vérifier qu'il y a des personnes
    if (personnes.length === 0) {
        showToast('Aucune donnée', 'Il n\'y a aucune donnée à copier. Veuillez d\'abord entrer les données du mois actuel.', 'warning');
        return;
    }

    // Vérifier que les nouveaux index sont renseignés
    const tousRenseignes = personnes.every(p => p.nouvelIndex > 0);
    if (!tousRenseignes) {
        showToast('Données incomplètes', 'Veuillez renseigner tous les nouveaux index avant de créer un nouveau mois.', 'warning');
        return;
    }

    // Demander confirmation
    const confirmation = confirm(
        '🗓️ Créer un nouveau mois ?\n\n' +
        '✅ Les nouveaux index actuels deviendront les anciens index\n' +
        '📝 Les nouveaux index seront vidés pour saisie\n' +
        '📅 Le mois sera incrémenté automatiquement\n' +
        '💰 La facture totale sera réinitialisée\n\n' +
        '⚠️ Pensez à SAUVEGARDER le mois actuel avant de continuer !'
    );

    if (!confirmation) {
        return;
    }

    // Copier les nouveaux index vers les anciens index
    personnes.forEach(personne => {
        personne.ancienIndex = personne.nouvelIndex;
        personne.nouvelIndex = 0;
        personne.conso = 0;
        personne.montant = 0;
    });

    // Incrémenter le mois
    const moisInput = document.getElementById('moisInput');
    if (moisInput.value) {
        const [annee, mois] = moisInput.value.split('-');
        let nouvelleDateMois = new Date(parseInt(annee), parseInt(mois), 1); // mois suivant automatique

        const nouvelleAnnee = nouvelleDateMois.getFullYear();
        const nouveauMois = String(nouvelleDateMois.getMonth()).padStart(2, '0');

        moisInput.value = `${nouvelleAnnee}-${nouveauMois}`;
        updateMoisLabel();
    }

    // Réinitialiser la facture totale
    document.getElementById('factureTotale').value = '';

    // Masquer le résumé
    document.getElementById('resumeCard').style.display = 'none';

    // Afficher les personnes avec les nouvelles valeurs
    afficherPersonnes();

    showToast(
        '✨ Nouveau mois créé !',
        'Les index ont été copiés. Vous pouvez maintenant saisir les nouveaux index et la facture du mois.',
        'success'
    );
}
