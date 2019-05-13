Template.printedSpellList.helpers({
    evaluateAttackBonus: function (charId, spellList) {
        var bonus = evaluate(charId, spellList.attackBonus);

        if (_.isFinite(bonus)) {
            return bonus > 0 ? "+" + bonus : "" + bonus;
        } else {
            return bonus;
        }
    },
    evaluateSaveDC: function (charId, spellList) {
        return evaluate(charId, spellList.saveDC);
    },
    evaluateMaxPrepared: function(charId, spellList) {
        return evaluate(charId, spellList.maxPrepared);
    },
    evaluateDescription: function (charId, spellList) {
        return evaluateString(charId, spellList.description);
    },
});
