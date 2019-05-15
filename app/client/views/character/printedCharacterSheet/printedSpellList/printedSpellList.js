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
    columnList: function () {
        return ["1", "2", "3"];
    },
    rowList: function () {
        return [1, 2, 3, 4];
    },
    spellGroupColumns: function (charId, spellList, col, row) {
        let spellsOfLevelCount = function (charId, spellList, spellLevel) {
            return Spells.find({
                charId: charId,
                "parent.id": spellList._id, level: spellLevel
            }).count();
        };
        let spellLevels = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        let columnList = {
            "1": [],
            "2": [],
            "3": [],
        };
        var counter = 1;
        for (var i = 0; i < spellLevels.length; i += 1) {
            if (spellsOfLevelCount(charId, spellList, spellLevels[i]) > 0) {
                columnList[parseInt(((counter - 1) % 3) + 1)].push(spellLevels[i]);
                counter++;
            }
        };
        return columnList[col][row - 1];
    },
    itemExists: function (item) {
        if (item != 0 && (!item || item == null || item == undefined)) {
            return false;
        }
        return true;
    },
});
